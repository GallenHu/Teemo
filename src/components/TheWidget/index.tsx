import { forwardRef } from 'react';
import Time from './Time';
import Holiday from './Holiday';
import { WidgetName } from '@/types/widget.d';

interface Props {
  name: string;
}

export default forwardRef<HTMLDivElement, Props>(function TheWidget(props, ref) {
  switch (props.name) {
    case WidgetName.TIME:
      return <Time ref={ref} />;
    case WidgetName.HOLIDAY:
      return <Holiday ref={ref} />;
    default:
      return null;
  }
});
