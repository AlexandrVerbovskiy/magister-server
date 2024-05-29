const timeConverter = (time) => {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

const shortTimeConverter = (time) => {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}/${day}/${year}`;
};

const getDateByCurrentAdd = (clientCurrentTime, daysToAdd = 0) => {
  const date = new Date(clientCurrentTime);
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(23, 59, 59, 999);
  return date;
};

const getDateByCurrentReject = (clientCurrentTime, daysToReject = 0) => {
  const date = new Date(clientCurrentTime);
  date.setDate(date.getDate() - daysToReject);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getOneHourAgo = () => {
  return new Date(Date.now() - 60 * 60 * 1000);
};

const formatDateToSQLFormat = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const clientServerHoursDifference = (clientTime) => {
  const serverTime = Date.now();
  const timeDifference = clientTime - serverTime;
  const hoursDiff = timeDifference / (1000 * 60 * 60);
  return Math.round(hoursDiff);
};

const adaptTimeByHoursDiff = (dateStr, hoursDiff, dopTime = null) => {
  const datePart = dateStr.split(" ")[0];
  const [month, day, year] = datePart.split("/").map(Number);
  let date = new Date(
    year,
    month - 1,
    day,
    dopTime?.h ?? 0,
    dopTime?.m ?? 0,
    dopTime?.s ?? 0,
    dopTime?.ms ?? 0
  );
  date.setHours(date.getHours() - hoursDiff);
  return timeConverter(date);
};

const adaptServerTimeToClient = (
  serverDateStr,
  clientServerHoursDiff,
  dopTime = null
) => adaptTimeByHoursDiff(serverDateStr, -clientServerHoursDiff, dopTime);

const adaptClientTimeToServer = (
  clientDateStr,
  clientServerHoursDiff,
  dopTime = null
) => adaptTimeByHoursDiff(clientDateStr, clientServerHoursDiff, dopTime);

const getDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const difference = Math.abs(end - start);
  return Math.ceil(difference / (1000 * 3600 * 24)) + 1;
};

const separateDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const generateDatesBetween = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  let currentDate = startDate;

  const datesObj = {};

  while (currentDate <= endDate) {
    const formattedDate = separateDate(currentDate);
    datesObj[formattedDate] = true;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return Object.keys(datesObj);
};

const listingListDateConverter = (date) => {
  const [m, d, y] = date.split(" ")[0].split("/");
  return `${y}-${m}-${d}`;
};

const baseGetStartEndInfo = (startDate, endDate) => {
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const startOfLastDate = timeConverter(startDate);
  const endOfLastDate = timeConverter(endDate);

  return {
    startDate: startOfLastDate,
    endDate: endOfLastDate,
  };
};

const getStartAndEndOfLastWeek = (clientTime) => {
  const currentDate = new Date(clientTime);
  const currentDay = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - currentDay - 6);

  const startOfLastWeek = new Date(startOfWeek);
  const endOfLastWeek = new Date(startOfWeek);

  endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);

  return baseGetStartEndInfo(startOfLastWeek, endOfLastWeek);
};

const getStartAndEndOfLastMonth = (clientTime) => {
  const currentDate = new Date(clientTime);
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const endOfLastMonth = new Date(startOfMonth);
  endOfLastMonth.setDate(0);

  const startOfLastMonth = new Date(
    endOfLastMonth.getFullYear(),
    endOfLastMonth.getMonth(),
    1
  );

  return baseGetStartEndInfo(startOfLastMonth, endOfLastMonth);
};

const getStartAndEndOfLastYear = (clientTime) => {
  const currentDate = new Date(clientTime);
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

  const startOfLastYear = new Date(startOfYear.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(startOfYear);
  endOfLastYear.setDate(endOfLastYear.getDate() - 1);

  return baseGetStartEndInfo(startOfLastYear, endOfLastYear);
};

const getStartAndEndOfYesterday = (clientTime) => {
  const currentDate = new Date(clientTime);
  const startOfToday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  const endOfYesterday = new Date(startOfToday);
  endOfYesterday.setHours(0, 0, 0, 0);
  endOfYesterday.setSeconds(endOfYesterday.getSeconds() - 1);

  return baseGetStartEndInfo(startOfYesterday, endOfYesterday);
};

const generateDatesByTypeBetween = (startDate, endDate, type = "hours") => {
  const dateMap = {};
  let currentDate = new Date(startDate);

  let step = 1;

  if (type == "days") {
    step = 24;
  }

  while (
    new Date(timeConverter(currentDate)) <= new Date(timeConverter(endDate))
  ) {
    if (type == "months") {
      const formattedDate = timeConverter(currentDate);
      const splittedMonth = formattedDate.split(" ")[0].split("/");
      const formattedMonth = splittedMonth[0] + "/" + splittedMonth[2];
      dateMap[formattedMonth] = 0;
      currentDate.setMonth(currentDate.getMonth() + step);
    } else {
      const formattedDate = timeConverter(currentDate);

      if (type == "days") {
        const formattedDateDays = formattedDate.split(" ")[0];
        dateMap[formattedDateDays] = 0;
      } else {
        dateMap[formattedDate] = 0;
      }

      currentDate.setTime(currentDate.getTime() + step * 60 * 60 * 1000);
    }
  }
  return dateMap;
};

const checkDateInDuration = (
  key,
  startInfo,
  endInfo,
  stepType,
  durationHours = 0
) => {
  const durationMilliseconds = durationHours * 60 * 60 * 1000;

  const startInfoDate = new Date(startInfo);
  const endInfoDate = new Date(endInfo);

  startInfoDate.setTime(startInfoDate.getTime() + durationMilliseconds);
  endInfoDate.setTime(endInfoDate.getTime() + durationMilliseconds);

  if (stepType == "hours") {
    startInfoDate.setMinutes(0, 0);
    endInfoDate.setMinutes(59, 59);
    
    startInfo = timeConverter(startInfoDate);
    endInfo = timeConverter(endInfoDate);

    return timeConverter(key) >= startInfo && timeConverter(key) <= endInfo;
  } else if (stepType == "days") {
    startInfo = shortTimeConverter(startInfoDate);
    endInfo = shortTimeConverter(endInfoDate);

    return (
      shortTimeConverter(key) >= startInfo && shortTimeConverter(key) <= endInfo
    );
  } else {
    startInfo = shortTimeConverter(startInfoDate);
    endInfo = shortTimeConverter(endInfoDate);

    const splittedStartInfo = startInfo.split("/");
    const startInfoMonth = splittedStartInfo[0];
    const startInfoYear = splittedStartInfo[2];

    const splittedEndInfo = endInfo.split("/");
    const endInfoMonth = splittedEndInfo[0];
    const endInfoYear = splittedEndInfo[2];

    const splittedKeyInfo = key.split("/");
    const keyInfoMonth = splittedKeyInfo[0];
    const keyInfoYear = splittedKeyInfo[1];

    const startDate = new Date(startInfoYear, startInfoMonth - 1, 1);
    const endDate = new Date(endInfoYear, endInfoMonth - 1, 1);
    const checkDate = new Date(keyInfoYear, keyInfoMonth - 1, 1);

    return checkDate >= startDate && checkDate <= endDate;
  }
};

module.exports = {
  timeConverter,
  getOneHourAgo,
  formatDateToSQLFormat,
  clientServerHoursDifference,
  adaptClientTimeToServer,
  adaptServerTimeToClient,
  getDateByCurrentAdd,
  getDateByCurrentReject,
  getDaysDifference,
  separateDate,
  generateDatesBetween,
  listingListDateConverter,
  shortTimeConverter,
  getStartAndEndOfLastWeek,
  getStartAndEndOfLastMonth,
  getStartAndEndOfLastYear,
  getStartAndEndOfYesterday,
  generateDatesByTypeBetween,
  checkDateInDuration,
};
