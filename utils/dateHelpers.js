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

const getDateByCurrentAdd = (clientHoursUtc, daysToAdd = 0) => {
  const date = new Date();

  date.setDate(date.getDate() + daysToAdd);
  date.setHours(23, 59, 59, 999);
  let time = date.getTime();
  time += clientHoursUtc * 60 * 60 * 1000;
  date.setTime(time);
  return date;
};

const getDateByCurrentReject = (clientHoursUtc, daysToReject = 0) => {
  const date = new Date();

  date.setDate(date.getDate() - daysToReject);
  date.setHours(0, 0, 0, 0);
  let time = date.getTime();
  time += clientHoursUtc * 60 * 60 * 1000;
  date.setTime(time);
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

module.exports = {
  timeConverter,
  getOneHourAgo,
  formatDateToSQLFormat,
  adaptClientTimeToServer,
  adaptServerTimeToClient,
  getDateByCurrentAdd,
  getDateByCurrentReject,
  getDaysDifference,
  separateDate,
  generateDatesBetween,
  listingListDateConverter,
  shortTimeConverter,
};
