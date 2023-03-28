import TriangleRight from 'baseui/icon/triangle-right';

export interface Child {
  text: string;
  onClickEvent: () => void;
}

export interface Props {
  children: Child[];
}

export default function PopupContainer(props: Props) {
  const { children } = props;
  return (
    <ul className="setting-popup-container">
      {children.map(child => {
        return (
          <li key={child.text} onClick={child.onClickEvent}>
            <TriangleRight /> {child.text}
          </li>
        );
      })}
    </ul>
  );
}
