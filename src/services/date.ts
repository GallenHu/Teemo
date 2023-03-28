import dayjs from 'dayjs';

export function getNextHoliday(): Promise<{ name: string; rest: number }> {
  const year = new Date().getFullYear();
  return new Promise((resolve, reject) => {
    fetch(`https://timor.tech/api/holiday/year/${year}/`)
      .then(response => response.json())
      .then(data => {
        const holiday = data?.holiday;

        if (holiday) {
          const holidayMap: Record<string, string> = {}; // {'节日名称': '2023-01-01'}

          Object.keys(holiday).forEach(date => {
            const name = holiday[date].name;
            const isHoliday = holiday[date].holiday;

            if (isHoliday && !holidayMap[name]) {
              holidayMap[name] = holiday[date].date;
            }
          });

          const now = dayjs();
          const incomingHolidayDates = Object.values(holidayMap)
            .filter(date => {
              return dayjs(date).isAfter(now);
            })
            .sort();
          const nextHolidayDate = incomingHolidayDates.length ? incomingHolidayDates[0] : null;

          if (nextHolidayDate) {
            const flip = (data: Record<string, string>) =>
              Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));

            const name = flip(holidayMap)[nextHolidayDate];
            const rest = dayjs(nextHolidayDate).diff(now, 'day');

            resolve({ name, rest });
          } else {
            resolve({ name: '下一次', rest: 365 });
          }
        } else {
          reject(new Error('holiday data error'));
        }
      })
      .catch(err => reject(err));
  });
}
