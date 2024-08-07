require("dotenv").config();
const request = require("request");

const main = () => {
  request(
    {
      method: "POST",
      url: `${process.env.SERVER_URL}/commands/pay-rent-for-owners`,
    },
    function (error, response, body) {
      if (error) {
        throw new Error(error);
      }
      
      console.log(response.body);
      process.exit();
    }
  );
};

main();
