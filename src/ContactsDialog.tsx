import Checkbox from "./Checkbox.tsx";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import { useEffect, useState } from "react";

interface Props {
  contacts: {
    id: number;
    name: string;
    phoneNum: string;
  }[];
  onClose: () => void;
  setSelectedIDs: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectedIDs: Set<number>;
}

const ContactsDialog = (props: Props) => {
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(props.contacts);

  const filterHandler = () => {
    const trimmedSearch = search.trim().toLowerCase();
    setFilteredContacts(
      props.contacts.filter(
        (contact) =>
          contact.name.trim().toLowerCase().includes(trimmedSearch) ||
          contact.phoneNum.includes(trimmedSearch),
      ),
    );
  };

  useEffect(() => {
    const timer = setTimeout(filterHandler, 700);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div
      role={"presentation"}
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-ink-bp/30 backdrop-blur-lg"
      }
      onClick={props.onClose}
    >
      <div
        className={
          "flex flex-col gap-2 overflow-hidden rounded-lg border border-neutral-99 bg-white p-4 shadow-lg"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <Input onChange={(e) => setSearch(e.target.value)} value={search} />
        <table className={"w-full"}>
          <thead className={"table w-full"}>
            <tr
              className={
                "overflow-hidden bg-primary-onContainer [&>*:first-child]:rounded-r-lg [&>*:last-child]:w-60 [&>*:last-child]:rounded-l-lg [&>th]:w-[400px] [&>th]:px-5 [&>th]:py-3"
              }
            >
              <th className={"!w-4"}>
                <Checkbox
                  checked={
                    props.selectedIDs.size === props.contacts.length
                      ? true
                      : props.selectedIDs.size === 0
                        ? false
                        : "half"
                  }
                  disabled={filteredContacts.length !== props.contacts.length}
                  onClick={() => {
                    if (props.selectedIDs.size === props.contacts.length) {
                      props.setSelectedIDs(new Set());
                    } else {
                      props.setSelectedIDs(
                        new Set(props.contacts.map((contact) => contact.id)),
                      );
                    }
                  }}
                />
              </th>
              <th align={"left"} className={"text-white"}>
                Name
              </th>
              <th align={"left"} className={"text-white"}>
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody
            className={
              "block max-h-80 w-full overflow-auto " +
              "[&>*:nth-child(even)]:bg-primary-onMain [&>tr>*:first-child]:w-14 [&>tr>*:last-child]:w-60 [&>tr>td]:w-[400px] [&>tr>td]:px-5 [&>tr>td]:py-2.5 [&>tr]:table [&>tr]:w-full [&>tr]:overflow-hidden [&>tr]:rounded-lg"
            }
          >
            {filteredContacts.map((contact, idx) => (
              <tr key={idx}>
                <td>
                  <Checkbox
                    checked={props.selectedIDs.has(contact.id)}
                    onClick={() => {
                      if (props.selectedIDs.has(contact.id)) {
                        props.setSelectedIDs((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(contact.id);
                          return newSet;
                        });
                      } else {
                        props.setSelectedIDs((prev) => {
                          const newSet = new Set(prev);
                          newSet.add(contact.id);
                          return newSet;
                        });
                      }
                    }}
                  />
                </td>
                <td>{contact.name}</td>
                <td>{contact.phoneNum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsDialog;
