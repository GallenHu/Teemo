import styles from './ScrollDown.module.css';

interface Props {
  color?: string;
  className?: string;
}

function ScrollDown(props: Props) {
  const onClickScrollBtn = () => {
    const win = window as any;
    win.fps.goToSlide(1);
  };

  return (
    <span className={styles.scroll} onClick={onClickScrollBtn}>
      <svg
        viewBox="0 0 1088 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="12026"
        width="20"
        height="20"
      >
        <path
          d="M512.128 758.656L192.512 518.976v252.16l319.616 252.352 317.76-258.688V514.048l-0.768-0.704-316.992 245.312zM512.128 260.48L192.512 7.616v252.096l319.616 253.76 317.76-260.096V2.624l-0.768-0.64L512.128 260.48z"
          fill={props.color || '#434343'}
          p-id="12027"
        ></path>
      </svg>
    </span>
  );
}

export default ScrollDown;
