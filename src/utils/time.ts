import dayjs from 'dayjs';
import chineseLunar from 'chinese-lunar';

export class TimeUtils {
  static format(date: Date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }
  static getHMS(date: Date) {
    return dayjs(date).format('HH:mm:ss');
  }
  static getDate(date: Date) {
    return dayjs(date).format('YYYY年MM月DD日');
  }
  static getDay(date: Date) {
    return new Date().getDay();
  }
  static getLunarDay(date: Date) {
    const lunar = chineseLunar.solarToLunar(date);
    return chineseLunar.format(lunar, 'MD');
  }
}

export default TimeUtils;
