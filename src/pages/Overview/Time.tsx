import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import styles from './Time.module.css';
import GeoUtils from "../../utils/GeoUtils";
import { getWeatherByGeo } from '../../api/weather';

export default function Time() {
  const [diffTime, setDiffTime] = useState(0);
  const [weather, setWeather] = useState("Loading...");
  const [weatherLoaded, setWeatherLoaded] = useState(false);
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

  const date = dayjs(now).format('YYYY-MM-DD');

  const queryWeather = (lng: number, lat: number) => {
    const apiKey = "77ac7b48e2ed4181a355f005103a1c6a";
    getWeatherByGeo(String(lng), String(lat), apiKey).then((data: any) => {
      const d = data.daily[0];
      const text = `${d.fxDate} 天气：${d.textDay}转${d.textNight} ${d.tempMin}~${d.tempMax}℃`;
      setWeather(text);
      setWeatherLoaded(true);
    });
  }

  useEffect(() => {
    getRemoteTime((remoteTime, localTime) => {
      setDiffTime(remoteTime.diff(localTime, 'second'));
    });

    GeoUtils.getPosition().then((data: any) => {
      queryWeather(data.lng, data.lat);
    }).catch(() => {
      setWeather(`${date} 获取位置信息失败无法加载天气`);
      setWeatherLoaded(true);
    });

    setInterval(() => {
      setNowTime(Date.now());
    }, 1000 * 10);
  }, []);

  return (
    <div className={styles.timeWrap}>
      <div className={[styles.time, extraClassName].join(' ')}>{displayTime}</div>
      <div className={[styles.subTitle, weatherLoaded && styles.loaded].join(' ')}>
        <span>{weather}</span>
      </div>
    </div>
  );
}
