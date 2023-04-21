import Time from './Time';
import { WidgetName } from '@/types/widget.d';
import { forwardRef } from 'react';

interface Props {
  name: string;
}

export default forwardRef<HTMLDivElement, Props>(function TheWidget(props, ref) {
  switch (props.name) {
    case WidgetName.TIME:
      return <Time ref={ref} />;
    default:
      return null;
  }
});
