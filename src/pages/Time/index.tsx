import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';

const Time = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [tipVisible, setTipVisible] = useState(false);

  let lastDate = '';

  const format = (num: number) => ('0' + num).slice(-2);

  const getTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = format(now.getMonth() + 1);
    const day = format(now.getDate());
    const hour = format(now.getHours());
    const min = format(now.getMinutes());
    const sec = format(now.getSeconds());
    const weekDay = now.getDay();

    const week = {
      '0': '天',
      '1': '一',
      '2': '二',
      '3': '三',
      '4': '四',
      '5': '五',
      '6': '六',
    } as { [key: string]: string };

    const showDate = `${year}年${month}月${day}日 星期${
      week[weekDay.toString()]
    }`;
    if (showDate !== lastDate) {
      setDate(showDate);
      lastDate = showDate;
    }
    setTime(`${hour}:${min}:${sec}`);
  };

  const getRemoteTime = (callback?: Function) => {
    axios.get('https://quan.suning.com/getSysTime.do').then((res) => {
      const time = res.data?.sysTime2 || '';
      callback && callback(time, Date.now());
    });
  };

  const compareTime = (time1: number, time2: number) => {
    const diff = Math.abs(time1 - time2);
    if (diff > 30 * 1000) {
      setTipVisible(true);
    }
  };

  useEffect(() => {
    setInterval(() => {
      getTime();
    }, 1000);

    getRemoteTime((time: string, localTime: number) => {
      if (time) {
        const ms = new Date(time).getTime();
        compareTime(ms, localTime);
      }
    });
  }, []);

  return (
    <div className="date-page">
      <div className="clock">
        <div className="date">{date}</div>
        <div className="time">{time}</div>
        {tipVisible ? (
          <div className="tip">注意：本地时间与服务器时间不符!</div>
        ) : null}
      </div>
    </div>
  );
};

export default Time;
