import { ButtonHTMLAttributes } from "react";

export type SizeSvgType = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3l";

export interface SvgProps extends ButtonHTMLAttributes<HTMLOrSVGElement> {
  children?: React.ReactNode;
  size?: SizeSvgType;
  viewBox?: SizeSvgType;
}

const SizeProp = (size: SizeSvgType) => {
  switch (size) {
    case "md":
      return "s-4";
    case "xs":
      return "s-2";
    case "sm":
      return "s-3";
    case "lg":
      return "s-5";
    case "xl":
      return "s-8";
    case "xxl":
      return "s-10";
    case "3l":
      return "s-12";
    default:
      return "s-4";
  }
};
const ViewBox = (viewBox: SizeSvgType) => {
  switch (viewBox) {
    case "md":
      return "0 0 16 16";
    case "xs":
      return "0 0 8 8";
    case "sm":
      return "0 0 12 12";
    case "lg":
      return "0 0 20 20";
    case "xl":
      return "0 0 24 24";
    case "xxl":
      return "0 0 32 32";
    case "3l":
      return "0 0 40 40";
    default:
      return "0 0 16 16";
  }
};

function Svg({
  children,
  size = "md",
  viewBox = "md",
  className,
  ...prop
}: SvgProps) {
  const sizes = SizeProp(size);
  const views = ViewBox(viewBox);

  return (
    <svg
      className={`inline-block h-4 w-4 ${sizes}${className ? " " + className : ""}`}
      viewBox={views}
      xmlns="http://www.w3.org/2000/svg"
      fill={"currentColor"}
      {...prop}
    >
      {children}
    </svg>
  );
}

export default Svg;
