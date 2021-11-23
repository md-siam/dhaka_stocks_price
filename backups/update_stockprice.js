require("dotenv").config();
const Parse = require("parse/node");

Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
Parse.serverURL = process.env.SERVER_URL;

const scrapeDate = "Jun 07, 2021";
const scrapeTime = "4:05 AM";

const scrapStock = [
  {
    TRADING_CODE: "1JANATAMF",
    LTP: 1,
    HIGH: 2,
    LOW: 3,
    CLOSEP: 4,
    YCP: 5,
    CHANGE: 6,
    TRADE: 7,
    VALUE: 8,
    VOLUME: 837337,
  },
  {
    TRADING_CODE: "1STPRIMFMF",
    LTP: 1,
    HIGH: 2,
    LOW: 3,
    CLOSEP: 4,
    YCP: 5,
    CHANGE: 6,
    TRADE: 7,
    VALUE: 8,
    VOLUME: 4234,
  },
  {
    TRADING_CODE: "AAMRANET",
    LTP: 1,
    HIGH: 2,
    LOW: 3,
    CLOSEP: 4,
    YCP: 5,
    CHANGE: 6,
    TRADE: 7,
    VALUE: 8,
    VOLUME: 33678345067,
  },
];
//console.table(scrapStock);
//console.log(scrapStock.length);

async function updateTime(scrapeTime) {
  const Stock = Parse.Object.extend("Stock");
  const queryStock = new Parse.Query(Stock);
  //const countObjects = await queryStock.find();

  const stock = await queryStock.findAll();

  for (let i = 0; i < stock.length; i++) {
    stock[i].set("upTime", scrapeTime);
    await stock[i].save().catch(function (error) {
      console.log("insertPrice error: " + error.message);
      //emailTrigger(true);
    });
    console.log(stock[i].get("upTime"));
    //console.log("\n");
  }
}
//updateTime(scrapeTime);

async function updateStockPrice(scrapeTime, scrapStock) {
  const StockPrice = Parse.Object.extend("StockPrice");
  const queryStockPrice = new Parse.Query(StockPrice);
  //const countObjects = await queryStock.find();
  //await updateTime(scrapeTime);

  const stockPrice = await queryStockPrice.findAll();

  for (let i = 0; i < scrapStock.length; i++) {
    stockPrice[i].set("LTP", scrapStock[i].LTP);
    stockPrice[i].set("HIGH", scrapStock[i].HIGH);
    stockPrice[i].set("LOW", scrapStock[i].LOW);
    stockPrice[i].set("CLOSEP", scrapStock[i].CLOSEP);
    stockPrice[i].set("YCP", scrapStock[i].YCP);
    stockPrice[i].set("CHANGE", scrapStock[i].CHANGE);
    stockPrice[i].set("TRADE", scrapStock[i].TRADE);
    stockPrice[i].set("VALUE", scrapStock[i].VALUE);
    stockPrice[i].set("VOLUME", scrapStock[i].VOLUME);
    await stockPrice[i].save().catch(function (error) {
      console.log("insertPrice error: " + error.message);
      //emailTrigger(true);
    });
    // console.log(stockPrice[i].get("LTP"));
    // console.log("\n");
  }
}
updateStockPrice(scrapeTime, scrapStock);
