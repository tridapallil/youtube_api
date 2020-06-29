import moment from 'moment';

class DaysCount {
  totalDays(week, videos) {
    const date = new Date();
    const initialDate = moment(date).format('YYYY-MM-DD');
    let finalDate = moment(date).format('YYYY-MM-DD');
    let dayDuration = moment.duration(
      `PT${
        week[
          moment(finalDate)
            .format('dddd')
            .toLowerCase()
        ]
      }M0S`
    );
    // foreach nos vídeos e ir calculando
    videos.forEach(row => {
      // if video longer than the longest day, continue
      if (row.longer) {
        return true;
      }
      // If video duration, is bigger than day's total time, add one day
      if (moment.duration(row.duration) > dayDuration) {
        while (moment.duration(row.duration) > dayDuration) {
          finalDate = moment(finalDate).add(1, 'days');
          dayDuration = moment.duration(
            `PT${
              week[
                moment(finalDate)
                  .format('dddd')
                  .toLowerCase()
              ]
            }M0S`
          );
        }
      }
      // Subtract video time from duration
      dayDuration = moment
        .duration(dayDuration)
        .subtract(moment.duration(row.duration).seconds(), 'seconds')
        .subtract(moment.duration(row.duration).minutes(), 'minutes')
        .subtract(moment.duration(row.duration).hours(), 'hours');
    });

    finalDate = moment(finalDate).add(1, 'days');

    return finalDate.diff(initialDate, 'days');
  }
}

export default new DaysCount();
