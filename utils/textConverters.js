// Function to convert a string from snake_case to camelCase
const snakeToCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()); // Replace underscores and capitalize the following letter

module.exports = {
  snakeToCamelCase, // Export the function for use in other parts of the application
};
