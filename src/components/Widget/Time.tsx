import { useState } from 'react';
import TimeUtils from '@/utils/time';
import { getNextHoliday } from '@/services/date';
import Clock from '@/components/FlipClock';

const now = new Date();
const date = TimeUtils.getDate(now);
const week = TimeUtils.getDay(now);
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const lunarDay = TimeUtils.getLunarDay(now);

export default function Time() {
  const [time, setTime] = useState(TimeUtils.getHMS(now));
  const [holiday, setHoliday] = useState({ name: '', rest: 0 });

  const getHoliday = async () => {
    const d = await getNextHoliday();
    setHoliday(d);
  };

  return (
    <div className="widget-time g-3-1">
      <div className="content">
        <div className="date">
          <span>{date}</span>
          <span className="week">{weekdays[week]}</span>
        </div>
        <Clock />
      </div>
    </div>
  );
}
