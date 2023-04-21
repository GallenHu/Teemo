import { forwardRef, useEffect, useState } from 'react';
import TimeUtils from '@/utils/time';
import { getNextHoliday } from '@/services/date';

const now = new Date();
const week = TimeUtils.getDay(now);
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const lunarDay = TimeUtils.getLunarDay(now);

const bgImg = 'https://img.picgo.net/2023/04/21/bg40a041b4ec48271b.webp';

export default forwardRef<HTMLDivElement>(function Time(_, ref) {
  const [holiday, setHoliday] = useState({ name: '', rest: 0 });

  const getHoliday = async () => {
    const d = await getNextHoliday();
    setHoliday(d);
  };

  useEffect(() => {
    !holiday.name && getHoliday();
  }, [getHoliday]);

  return (
    <div ref={ref} className="widget widget-holiday g-2-2 with-mask">
      <div className="content" style={{ backgroundImage: `url(${bgImg})` }}>
        <div className="mask"></div>
        <div className="content-inner">
          <div className="desc">距离{holiday.name}还有</div>
          <div className="day">
            {holiday.rest}
            <small>天</small>
          </div>
          <div className="extra">
            {lunarDay}
            <span style={{ marginLeft: '1em' }}>{weekdays[week]}</span>
          </div>
        </div>
      </div>
      <div className="name">节假日</div>
    </div>
  );
});
