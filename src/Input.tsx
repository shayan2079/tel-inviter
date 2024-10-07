const Input = ({
  className,
  disabled,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  return (
    <input
      className={
        "h-10 rounded-lg border border-gray-700 px-2 text-gray-950 outline-none " +
        (disabled ? " bg-gray-300" : " hover:border-gray-900") +
        ` ${className}`
      }
      disabled={disabled}
      {...props}
    />
  );
};

export default Input;
