export const durationToString = (duration: string) => {
  if (duration !== null && duration !== undefined) {
    if (duration == '00:00:00') return undefined;

    const [hours, minutes] = duration.split(':');

    if (hours) {
      const hoursInt = parseInt(hours);
      const hoursToMinutes = hoursInt * 60;

      const minutesInt = parseInt(minutes!);
      const totalMinutes = hoursToMinutes + minutesInt;
      if (totalMinutes == 1) {
        return `${totalMinutes} minute`;
      } else {
        return `${totalMinutes} minutes`;
      }
    }
  }
};

export const durationToMinutes = (duration: string) => {
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

export const stringToDuration = (duration: string) => {
  return `00:${duration}:00`;
};
