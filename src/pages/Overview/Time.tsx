import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import {Solar, Lunar, HolidayUtil} from 'lunar-typescript';
import styles from './Time.module.css';

export default function Time() {
  const [diffTime, setDiffTime] = useState(0);
  const [now, setNowTime] = useState(Date.now());

  const getRemoteTime = (callback?: (remoteTime: Dayjs, localTime: Dayjs) => void) => {
    axios.get('https://hi-api.vercel.app/v1/time').then((res) => {
      const time = res.data.data?.time || '';
      callback && callback(dayjs(time), dayjs(now));
    });
  };

  const isErrorLocalTime = diffTime > 30;
  const extraClassName = isErrorLocalTime ? styles.error : styles.ok;

  const displayTime = dayjs(now).format('HH:mm');
  const d = Solar.fromDate(new Date());
  const date = d.toYmd();
  const weekDay = '星期' + d.getWeekInChinese();
  const lunar = d.getLunar();
  const lunarMonth = lunar.getMonthInChinese() + '月';
  const lunarDay = lunar.getDayInChinese();

  const displayDate = `${date} ${weekDay} ${lunarMonth}${lunarDay}`;

  useEffect(() => {
    getRemoteTime((remoteTime, localTime) => {
      setDiffTime(remoteTime.diff(localTime, 'second'));
    });

    setInterval(() => {
      setNowTime(Date.now());
    }, 1000 * 10);
  });

  return (
    <div className={styles.timeWrap}>
      <div className={[styles.time, extraClassName].join(' ')}>{displayTime}</div>
      <div className={styles.date}>{displayDate}</div>
    </div>
  );
}
