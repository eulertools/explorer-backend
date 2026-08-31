export const getDateTime = (datetime: any) => {
  let dd: number | string = datetime.getDate();
  let mm: number | string = datetime.getMonth() + 1;
  const yyyy = datetime.getFullYear();
  let hour = datetime.getHours();
  let minutes = datetime.getMinutes();

  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  return `${yyyy}-${mm}-${dd}T${hour}:${minutes}`;
};

export const getBegginingOfTheDay = (date: any) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return new Date(start.getTime()).toISOString();
};

export const getEndOfTheDay = (date: any) => {
  const start = new Date(date);
  start.setUTCHours(23, 59, 59, 999);
  return new Date(start.getTime()).toISOString();
};

export const dateRange = (startDate: any, endDate: any, steps = 1) => {
  const dateArray = [];
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
};

export const isToday = (checkDate: any) => {
  const today = new Date();
  const someDate = new Date(checkDate);
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};
