export const dbDurationToMinutes = (duration: string) => {
  if (duration !== null && duration !== undefined) {
    if (duration == '00:00:00') return undefined;

    const [hours, minutes] = duration.split(':');

    if (hours) {
      const hoursInt = parseInt(hours);
      const hoursToMinutes = hoursInt * 60;

      const minutesInt = parseInt(minutes!);
      const totalMinutes = hoursToMinutes + minutesInt;
      if (totalMinutes == 1) {
        return `${totalMinutes}`;
      } else {
        return `${totalMinutes}`;
      }
    }
  }
};

export const minutesToString = (minutes: string | undefined) => {
  if (minutes == undefined) return undefined;

  if (minutes == '1') {
    return `${minutes} minute`;
  } else {
    return `${minutes} minutes`;
  }
};

export const stringToDuration = (duration: string | undefined) => {
  if (duration == undefined) return '00:00:00';

  return `00:${duration}:00`;
};
