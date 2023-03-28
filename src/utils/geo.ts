export class GeoUtils {
  getPosition(): Promise<{ lat: number; lng: number }> {
    if ('geolocation' in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      return new Promise((resolve, reject) => {
        const onSuccess = (position: { coords: any }) => {
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        };

        const onError = (err: any) => {
          let msg = 'geo 拒绝';
          switch (err.code) {
            case 1:
              msg = 'geo 拒绝';
              break;
            case 2:
              msg = 'geo 获取不到';
              break;
            case 3:
              msg = 'geo 超时';
              break;

            default:
              msg = err.code;
              break;
          }

          reject(msg);
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
      });
    } else {
      /* 地理位置服务不可用 */
      return Promise.reject('geo cannot work');
    }
  }
}

export default new GeoUtils();
