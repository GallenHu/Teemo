import { useEffect } from 'react';

/**
 * https://widget.qweather.com/
 */
export default function HeWeather() {
  useEffect(() => {
    (window as any).WIDGET = {
      CONFIG: {
        modules: '01234',
        background: '5',
        tmpColor: 'FFFFFF',
        tmpSize: '14',
        cityColor: 'FFFFFF',
        citySize: '14',
        aqiColor: 'FFFFFF',
        aqiSize: '14',
        weatherIconSize: '20',
        alertIconSize: '14',
        padding: '10px 10px 10px 10px',
        shadow: '0',
        language: 'auto',
        borderRadius: '5',
        fixed: 'true',
        vertical: 'center',
        horizontal: 'center',
        left: '20',
        top: '20',
        key: 'a2a07f04a3844dd8bceac452e91bb637',
      },
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0';
    document.getElementsByTagName('head')[0].appendChild(script);
  });

  return <div id="he-plugin-simple"></div>;
}
