export default function Background() {
  return (
    <div className="desktop-bg">
      <div
        className="desktop-bg-img"
        style={{
          backgroundImage: 'url(https://static.199100.xyz/images/wallpagers/snow-mountain_w5084.webp)',
        }}
      ></div>
      <div className="desktop-bg-mask" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
    </div>
  );
}
