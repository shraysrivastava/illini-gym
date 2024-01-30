import moment from 'moment';

export const getTimeDifference = (lastUpdated: string): string => {
  const lastUpdatedMoment = moment(lastUpdated, 'MM/DD/YYYY hh:mm:ss A');
  const now = moment();

  if (!lastUpdatedMoment.isValid()) {
    // console.error('Invalid date format');
    return 'Date format error';
  }

  if (isGymClosed(now)) {
    return `ARC reopens at ${getNextOpeningTime(now)}`;
  }

  // Check if the difference is more than 24 hours
  if (now.diff(lastUpdatedMoment, 'hours') >= 24) {
    const dayWithOrdinal = getOrdinalSuffix(lastUpdatedMoment.date());
    return "Last updated: " + `${lastUpdatedMoment.format('MMM')} ${dayWithOrdinal}, ${lastUpdatedMoment.format('YYYY, h:mm A')}`;
  }

  const duration = moment.duration(now.diff(lastUpdatedMoment));
  let hours = duration.asHours();

  if (hours >= 1) {
    // Round to the nearest half-hour
    hours = Math.round(hours * 2) / 2;
    return "Last Updated: " + `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const minutes = Math.floor(duration.asMinutes());
    return "Last Updated: " + `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
};

export const isGymClosed = (currentTime: moment.Moment) => {
  // return false;
  const weekDay = currentTime.day();
  const hour = currentTime.hour();

  // Weekdays: Monday (1) to Thursday (4)
  if (weekDay >= 1 && weekDay <= 4) {
    return hour < 6 || hour >= 23; // Closed outside 6 AM to 11 PM
  }
  // Friday
  if (weekDay === 5) {
    return hour < 6 || hour >= 22; // Closed outside 6 AM to 10 PM
  }
  // Weekend: Saturday (6) and Sunday (0)
  return hour < 9 || hour >= 22; // Closed outside 9 AM to 10 PM
};

export const getNextOpeningTime = (currentTime: moment.Moment) => {
  const weekDay = currentTime.day();

  // Weekdays
  if (weekDay >= 0 && weekDay <= 4) {
    return '6 AM';
  }
  // Weekend
  return '9 AM';
};
export const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  }
  