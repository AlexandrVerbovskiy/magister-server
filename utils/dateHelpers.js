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
  const endOfLastWeek = new Date(currentDate);
  const startOfLastWeek = new Date(currentDate);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  return baseGetStartEndInfo(startOfLastWeek, endOfLastWeek);
};

const getStartAndEndOfLastMonth = (clientTime) => {
  const currentDate = new Date(clientTime);
  const endOfLastMonth = new Date(currentDate);
  const startOfLastMonth = new Date(currentDate);
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
  return baseGetStartEndInfo(startOfLastMonth, endOfLastMonth);
};

const getStartAndEndOfLastYear = (clientTime) => {
  const currentDate = new Date(clientTime);
  const endOfLastYear = new Date(currentDate);
  const startOfLastYear = new Date(currentDate);
  startOfLastYear.setFullYear(startOfLastYear.getFullYear() - 1);
  return baseGetStartEndInfo(startOfLastYear, endOfLastYear);
};

const getStartAndEndOfYesterday = (clientTime) => {
  const currentDate = new Date(clientTime);
  const endOfLastDay = new Date(currentDate);
  const startOfLastDay = new Date(currentDate);
  startOfLastDay.setDate(startOfLastDay.getDate() - 1);
  return baseGetStartEndInfo(startOfLastDay, endOfLastDay);
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

  const startInfoDate = startInfo ? new Date(startInfo) : null;
  const endInfoDate = endInfo ? new Date(endInfo) : null;

  if (startInfoDate) {
    startInfoDate.setTime(startInfoDate.getTime() + durationMilliseconds);
  }

  if (endInfoDate) {
    endInfoDate.setTime(endInfoDate.getTime() + durationMilliseconds);
  }

  let startPart = true;
  let endPart = true;

  if (stepType == "hours") {
    if (startInfoDate) {
      startInfoDate.setMinutes(0, 0);
      startInfo = timeConverter(startInfoDate);
      startPart = timeConverter(key) >= startInfo;
    }

    if (endInfoDate) {
      endInfoDate.setMinutes(59, 59);
      endInfo = timeConverter(endInfoDate);
      endPart = timeConverter(key) <= endInfo;
    }
  } else if (stepType == "days") {
    if (startInfoDate) {
      startPart = shortTimeConverter(key) >= shortTimeConverter(startInfoDate);
    }

    if (endInfoDate) {
      endPart = shortTimeConverter(key) <= shortTimeConverter(endInfoDate);
    }
  } else {
    const splittedKeyInfo = key.split("/");
    const keyInfoMonth = splittedKeyInfo[0];
    const keyInfoYear = splittedKeyInfo[1];
    const checkDate = new Date(keyInfoYear, keyInfoMonth - 1, 1);

    if (startInfoDate) {
      startInfo = shortTimeConverter(startInfoDate);
      const splittedStartInfo = startInfo.split("/");
      const startInfoMonth = splittedStartInfo[0];
      const startInfoYear = splittedStartInfo[2];
      const startDate = new Date(startInfoYear, startInfoMonth - 1, 1);
      startPart = checkDate >= startDate;
    }

    if (endInfoDate) {
      endInfo = shortTimeConverter(endInfoDate);
      const splittedEndInfo = endInfo.split("/");
      const endInfoMonth = splittedEndInfo[0];
      const endInfoYear = splittedEndInfo[2];
      const endDate = new Date(endInfoYear, endInfoMonth - 1, 1);
      endPart = checkDate <= endDate;
    }
  }

  return startPart && endPart;
};

const isDateAfterStartDate = (key, startInfo, stepType, durationHours) => {
  const durationMilliseconds = durationHours * 60 * 60 * 1000;

  const startInfoDate = new Date(startInfo);
  startInfoDate.setTime(startInfoDate.getTime() + durationMilliseconds);

  if (stepType == "hours") {
    startInfoDate.setMinutes(0, 0);
    startInfo = timeConverter(startInfoDate);
    return timeConverter(key) >= startInfo;
  } else if (stepType == "days") {
    startInfo = shortTimeConverter(startInfoDate);
    return shortTimeConverter(key) >= startInfo;
  } else {
    startInfo = shortTimeConverter(startInfoDate);

    const splittedStartInfo = startInfo.split("/");
    const startInfoMonth = splittedStartInfo[0];
    const startInfoYear = splittedStartInfo[2];

    const splittedKeyInfo = key.split("/");
    const keyInfoMonth = splittedKeyInfo[0];
    const keyInfoYear = splittedKeyInfo[1];

    const startDate = new Date(startInfoYear, startInfoMonth - 1, 1);
    const checkDate = new Date(keyInfoYear, keyInfoMonth - 1, 1);

    return checkDate >= startDate;
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
  isDateAfterStartDate,
};
