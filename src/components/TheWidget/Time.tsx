import { useState, useRef, useEffect, forwardRef } from 'react';
import TimeUtils from '@/utils/time';
import { getNextHoliday } from '@/services/date';
import Clock from '@/components/FlipClock';
import screenfull from 'screenfull';

const now = new Date();
const date = TimeUtils.getDate(now);
const week = TimeUtils.getDay(now);
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const lunarDay = TimeUtils.getLunarDay(now);

export default forwardRef<HTMLDivElement>(function Time(_, ref) {
  const clockElm = useRef(null);
  const [isScreenFull, setIsScreenFull] = useState(false);
  const [time, setTime] = useState(TimeUtils.getHMS(now));
  const [holiday, setHoliday] = useState({ name: '', rest: 0 });

  const getHoliday = async () => {
    const d = await getNextHoliday();
    setHoliday(d);
  };

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
