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

  console.log(upDate + " " + upTime);
  if (upDate == scrapeDate && upTime == scrapeTime) {
    return 0;
    console.log("Do nothing");
  } else if (upDate == scrapeDate && upTime != scrapeTime) {
    console.log("Update previous stock price");
  } else if (upDate != scrapeDate && upTime == scrapeTime) {
    console.log("Insert new stock price. This will also update the Date&Time");
  } else {
    console.log("Insert new stock price.This will also update the Date&Time");
  }
}
readDateTime(scrapeDate, scrapeTime);
