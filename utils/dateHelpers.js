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

module.exports = {
  getYesterdayDate,
  getTodayDate,
  timeConverter,
};
