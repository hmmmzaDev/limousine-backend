export function isTimeStampNewer(timestamp: string, days: number): boolean {
  const inputDate = new Date(timestamp);

  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - inputDate.getTime();

  const daysInMilliseconds = days * 24 * 60 * 60 * 1000;

  return timeDifference < daysInMilliseconds;
}

export function checkTimeStatus(): string {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  if (hour < 9) {
    return "early";
  } else if (hour > 9 || (hour === 9 && minute > 20)) {
    return "late";
  } else {
    return "on-time";
  }
}

export function checkOutTimeStatus(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  return hour < 17;
}
