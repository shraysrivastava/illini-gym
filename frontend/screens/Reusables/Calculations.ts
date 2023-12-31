import moment from 'moment';

export const getTimeDifference = (lastUpdated: string): string => {
  const lastUpdatedMoment = moment(lastUpdated, 'MM/DD/YYYY hh:mm:ss A');
  const now = moment();

  if (!lastUpdatedMoment.isValid()) {
    console.error('Invalid date format');
    return 'Date format error';
  }

  // Check if the difference is more than 24 hours
  if (now.diff(lastUpdatedMoment, 'hours') >= 24) {
    const dayWithOrdinal = getOrdinalSuffix(lastUpdatedMoment.date());
    return `${lastUpdatedMoment.format('MMM')} ${dayWithOrdinal}, ${lastUpdatedMoment.format('YYYY, h:mm A')}`;
  }

  const duration = moment.duration(now.diff(lastUpdatedMoment));
  let hours = duration.asHours();

  if (hours >= 1) {
    // Round to the nearest half-hour
    hours = Math.round(hours * 2) / 2;
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const minutes = Math.floor(duration.asMinutes());
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
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
  