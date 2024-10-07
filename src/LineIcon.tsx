import Svg, { SvgProps } from "./Svg.tsx";

const LineIcon = (props: SvgProps) => {
  return (
    <Svg {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 7.99999C4 7.63181 4.16281 7.33333 4.36364 7.33333H11.6364C11.8372 7.33333 12 7.63181 12 7.99999C12 8.36818 11.8372 8.66666 11.6364 8.66666H4.36364C4.16281 8.66666 4 8.36818 4 7.99999Z"
      />
    </Svg>
  );
};

export default LineIcon;
