import axios from 'axios';

export function getCityByGeo(log: string, lat: string, key: string) {
  return axios
    .get(`https://geoapi.qweather.com/v2/city/lookup?location=${log},${lat}&key=${key}`)
    .then((res) => {
      if (res.status === 200 && res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}

export function getWeatherByGeo(log: string, lat: string, key: string) {
  return axios
    .get(`https://devapi.qweather.com/v7/weather/3d?location=${log},${lat}&key=${key}`)
    .then((res) => {
      if (res.status === 200 && res.data) {
        return res.data;
      } else {
        return null;
      }
    });
}
