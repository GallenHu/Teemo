interface Props {
  bgColor: string;
  text: string;
}

export default function IconColorBg(props: Props) {
  const { bgColor, text } = props;
  const displayText = text.slice(0, 2);
  return (
    <div className={['icon', `color-icon-${displayText.length}`].join(' ')} style={{ backgroundColor: bgColor }}>
      {displayText.slice(0, 2).toUpperCase()}
    </div>
  );
}
