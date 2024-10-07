import CheckIcon from "./CheckIcon.tsx";
import LineIcon from "./LineIcon.tsx";

interface Props {
  /**
   * State of the input
   */
  checked: boolean | "half";
  /**
   * Click handler function
   */
  onClick?: () => void;
  /**
   * Is input disabled?
   */
  disabled?: boolean;
}

const Checkbox = ({ checked, onClick, disabled = false }: Props) => {
  const selected = checked !== false;
  const iconClasses =
    "w-2.5 " + (disabled ? "text-neutral-70" : "text-neutral-101");

  return (
    <div
      className={"group flex w-fit cursor-pointer items-center gap-2"}
      onClick={() => {
        if (!disabled) onClick?.();
      }}
    >
      <div
        className={
          "outline-primary-95 flex h-4 w-4 items-center justify-center rounded outline-2 " +
          (disabled
            ? "border-neutral-95 bg-neutral-99 border"
            : selected
              ? "bg-primary-40 group-hover:bg-primary-30 group-active:outline"
              : "border-neutral-95 bg-neutral-101 group-hover:border-primary-30 border group-active:border-none group-active:outline")
        }
      >
        {checked === true ? (
          <CheckIcon className={iconClasses} />
        ) : (
          checked === "half" && <LineIcon className={iconClasses} />
        )}
      </div>
    </div>
  );
};

export default Checkbox;
