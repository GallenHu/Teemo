interface Props {
  url: string;
}

export default function Background(props: Props) {
  return (
    <div className="desktop-bg">
      <div
        className="desktop-bg-img"
        style={{
          backgroundImage: `url(${props.url})`,
        }}
      ></div>
      <div className="desktop-bg-mask" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
    </div>
  );
}
