const timeConverter = (time) => {
  const dateObject = new Date(time);

  const formattedDate = dateObject.toLocaleDateString("en-US");
  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}`;
};

const getTodayDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);
  return yesterday;
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

module.exports = {
  getYesterdayDate,
  getTodayDate,
  timeConverter,
  getOneHourAgo,
  formatDateToSQLFormat,
};
