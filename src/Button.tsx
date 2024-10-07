interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  isLoading?: boolean;
}

const Button = ({
  className,
  type,
  isLoading,
  children,
  disabled,
  ...props
}: Props) => {
  return (
    <button
      className={
        "h-10 rounded-lg border border-gray-800 text-gray-900 outline-2 outline-gray-800" +
        (isLoading || disabled
          ? " bg-gray-300"
          : " hover:text-gray-950 hover:outline active:outline-gray-400") +
        ` ${className}`
      }
      type={type || "button"}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
