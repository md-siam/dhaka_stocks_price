require("dotenv").config();
const Parse = require("parse/node");

Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
Parse.serverURL = process.env.SERVER_URL;

const scrapeDate = "Jun 10, 2021";
const scrapeTime = "3:45 PM";

//this read function will run inside the main function
async function readDateTime(scrapeDate, scrapeTime) {
  const Stock = Parse.Object.extend("Stock");
  const queryStock = new Parse.Query(Stock);
  const stock = await queryStock.first();

  let upDate = stock.get("upDate");
  let upTime = stock.get("upTime");

  console.log("Date: " + upDate + " and Time: " + upTime);
  if (upDate == scrapeDate && upTime == scrapeTime) {
    console.log("Everything is up-to-date\n");
    return 0;
  } else if (upDate == scrapeDate && upTime != scrapeTime) {
    console.log("updateStockPrice: Activated!");
    return 0;
  } else if (upDate != scrapeDate && upTime == scrapeTime) {
    console.log("insertStockPrice: Activated!");
    return 0;
  } else {
    console.log("insertStockPrice: Activated!");
    return 0;
  }
}
readDateTime(scrapeDate, scrapeTime);
