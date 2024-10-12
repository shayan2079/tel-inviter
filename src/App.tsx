import { useState } from "react";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import { toast, ToastContainer } from "react-toastify";
import ContactsDialog from "./ContactsDialog.tsx";
import "react-toastify/dist/ReactToastify.css";

const API_ID = parseInt(import.meta.env.VITE_API_ID);
const API_HASH = import.meta.env.VITE_API_HASH;
const SESSION = new StringSession();

const client = new TelegramClient(SESSION, API_ID, API_HASH, {
  connectionRetries: 5,
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wasCodeSent, setWasCodeSent] = useState(false);
  const [pass, setPass] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNum, setPhoneNum] = useState("");
  const [code, setCode] = useState("");
  const [channelId, setChannelId] = useState(0);
  const [contacts, setContacts] = useState<
    { id: number; name: string; phoneNum: string }[]
  >([]);
  const [selectedIDs, setSelectedIDs] = useState<Set<number>>(new Set());

  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");

  const [loadingStep, setLoadingStep] = useState("");

  async function sendCodeHandler(): Promise<void> {
    try {
      setLoadingStep("phone");
      setIsLoggedIn(false);
      setContacts([]);
      setSelectedIDs(new Set());
      setChannelId(0);
      await client.connect();
      await client.sendCode(
        {
          apiId: API_ID,
          apiHash: API_HASH,
        },

        phoneNum,
      );
      setWasCodeSent(true);
      toast.success("A code has been sent to your telegram account");
    } catch (e: unknown) {
      alert(e?.message);
    }
    setLoadingStep("");
  }

  async function clientStartHandler(): Promise<void> {
    try {
      setLoadingStep("code");
      await client.start({
        phoneNumber: phoneNum,
        password: userAuthParamCallback(pass),
        phoneCode: userAuthParamCallback(code),
        onError: (e) => {
          console.log(e);
        },
      });

      setIsLoggedIn(true);
      toast.success("You're now logged in");
      await getContacts();
    } catch (e: unknown) {
      alert(e?.message);
    }
    setLoadingStep("");
  }

  function userAuthParamCallback<T>(param: T): () => Promise<T> {
    return async function () {
      return await new Promise<T>((resolve) => {
        resolve(param);
      });
    };
  }

  const getContacts = async () => {
    try {
      setLoadingStep("contacts");
      await client.connect();
      // console.log(222222);
      // const ids = [7949644721n, 92003874n];
      // let hash = 0n;
      // for (const id of ids) {
      //   console.log(id);
      //   hash = hash ^ (hash >> 21n);
      //   hash = hash ^ (hash << 35n);
      //   hash = hash ^ (hash >> 4n);
      //   hash = hash + id;
      // }
      // console.log(44444);
      const result = await client.invoke(new Api.contacts.GetContacts({}));
      setContacts(
        result.users.map((user) => ({
          id: user.id.value,
          name:
            user.firstName && user.lastName
              ? user.firstName + " " + user.lastName
              : user.lastName
                ? user.lastName
                : user.firstName
                  ? user.firstName
                  : "_",
          phoneNum: "0" + user.phone,
        })),
      );
      toast.success("Contacts fetched successful!");
    } catch (e: unknown) {
      alert(e?.message);
    }
    setLoadingStep("");
  };

  const createGroup = async () => {
    try {
      setLoadingStep("group");
      await client.connect();
      const result = await client.invoke(
        new Api.channels.CreateChannel({
          title: groupName,
          about: groupDesc,
          megagroup: true,
          forImport: true,
        }),
      );
      setChannelId(result.updates[1].channelId.value);
      toast.success("Group created successfully!");
    } catch (e: unknown) {
      alert(e?.message);
    }
    setLoadingStep("");
  };

  const inviteToGroup = async () => {
    try {
      setLoadingStep("invite");
      await client.connect(); // This assumes you have already authenticated with .start()

      await client.invoke(
        new Api.channels.InviteToChannel({
          channel: channelId,
          users: Array.from(selectedIDs),
        }),
      );
      toast.success("Contacts added successfully!");
    } catch (e: unknown) {
      alert(e?.message);
    }
    setLoadingStep("");
  };

  return (
    <div className={"mx-auto flex max-w-80 flex-col gap-5 p-5"}>
      <Input
        value={phoneNum}
        onChange={(e) => setPhoneNum(e.target.value)}
        placeholder={"0989121111111"}
      />
      <Button onClick={sendCodeHandler} isLoading={loadingStep === "phone"}>
        Request a Code
      </Button>

      <Input
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder={"password"}
        disabled={!wasCodeSent}
      />
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={"code"}
        disabled={!wasCodeSent}
      />
      <Button
        onClick={clientStartHandler}
        disabled={!wasCodeSent}
        isLoading={loadingStep === "code"}
      >
        Confirm Code
      </Button>
      <Input
        placeholder={"Group name"}
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        disabled={!isLoggedIn}
      />
      <Input
        placeholder={"Group description"}
        value={groupDesc}
        onChange={(e) => setGroupDesc(e.target.value)}
        disabled={!isLoggedIn}
      />
      <Button
        onClick={createGroup}
        disabled={!isLoggedIn}
        isLoading={loadingStep === "group"}
      >
        Create Group
      </Button>
      <Button
        onClick={getContacts}
        disabled={!isLoggedIn}
        isLoading={loadingStep === "contacts"}
      >
        Get Contacts
      </Button>
      <div className={"flex flex-col"}>
        <Button onClick={() => setIsOpen(true)} disabled={!isLoggedIn}>
          Select Contacts to Invite
        </Button>
        <p className={"text-sm"}>
          ({selectedIDs.size} of {contacts.length} contact are selected)
        </p>
      </div>
      <Button
        onClick={inviteToGroup}
        disabled={!isLoggedIn || selectedIDs.size === 0 || channelId === 0}
        isLoading={loadingStep === "invite"}
      >
        Invite to the Group
      </Button>
      {isOpen && (
        <ContactsDialog
          contacts={contacts}
          onClose={() => setIsOpen(false)}
          selectedIDs={selectedIDs}
          setSelectedIDs={setSelectedIDs}
        />
      )}
      <ToastContainer theme={"dark"} />
    </div>
  );
}

export default App;
