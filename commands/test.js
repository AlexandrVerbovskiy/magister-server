const fetch = require("node-fetch");
const key = "AIzaSyB2tq-tFsqlE4rG7deKuxIh0QTTim0gFmk";

const main = async () => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&address=Lviv`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
};

main();