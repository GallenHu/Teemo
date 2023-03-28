import Time from './Time';
import { WidgetName } from '@/types/widget.d';

interface Props {
  name: string;
}

export default function Widget(props: Props) {
  switch (props.name) {
    case WidgetName.TIME:
      return <Time />;
    default:
      return null;
  }
}
