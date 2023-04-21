import { forwardRef, useEffect, useRef, useState } from 'react';
import Clock from '@/components/FlipClock';
import screenfull from 'screenfull';

export default forwardRef<HTMLDivElement>(function Time(_, ref) {
  const clockElm = useRef(null);
  const [isScreenFull, setIsScreenFull] = useState(false);

  function handleClickClock() {
    if (screenfull.isEnabled) {
      if (!isScreenFull) {
        screenfull.request(clockElm.current!);
      }
    }
  }

  function handleDBClickClock() {
    if (isScreenFull) {
      screenfull.exit();
    }
  }

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        setIsScreenFull(screenfull.isFullscreen);
      });
    }
  }, []);

  return (
    <div ref={ref} className="widget widget-time g-2-1">
      <div
        className={['content', isScreenFull && 'is-screenfull'].join(' ')}
        ref={clockElm}
        onClick={handleClickClock}
        onDoubleClick={handleDBClickClock}
      >
        <Clock showSeconds={isScreenFull} />
      </div>
      <div className="name">时间</div>
    </div>
  );
});
