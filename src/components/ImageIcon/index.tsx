interface Props {
  src: string;
  height: string;
}

export default function (props: Props) {
  return (
    <span
      className="inline-block mr-[6px] w-[18px] h-[18px] bg-contain bg-no-repeat bg-center rounded"
      style={{ backgroundImage: `url(${props.src})`, height: props.height }}
    ></span>
  );
}
