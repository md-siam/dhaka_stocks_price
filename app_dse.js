const { emailTrigger } = require("./emailtrigger.js");
require("dotenv").config();
const Parse = require("parse/node");
const request = require("request");
const cheerio = require("cheerio");

Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
Parse.serverURL = process.env.SERVER_URL;

//*____________________________________________this function will update time of all the Stocks
async function updateTime(scrapeTime) {
  const Stock = Parse.Object.extend("Stock");
  const queryStock = new Parse.Query(Stock);
  //const countObjects = await queryStock.find();

  const stock = await queryStock.findAll();

  console.log("Updating time of Stock class..");
  for (let i = 0; i < stock.length; i++) {
    stock[i].set("upTime", scrapeTime);
    await stock[i].save().catch(function (error) {
      console.log("updateTime error: " + error.message);
      emailTrigger(true);
    });
    //console.log(stock[i].get("upTime"));
    //console.log("\n");
  }
}

//!_____________________________________this function will update date & time of all the Stocks
async function updateStockPrice(scrapeTime, scrapStock) {
  const StockPrice = Parse.Object.extend("StockPrice");
  const queryStockPrice = new Parse.Query(StockPrice);
  //const countObjects = await queryStock.find();

  await updateTime(scrapeTime);
  const stockPrice = await queryStockPrice.findAll();
  console.log("Stocks Price updating..");
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
      console.log("updateStockPrice error: " + error.message);
      emailTrigger(true);
    });
    // console.log(stockPrice[i].get("LTP"));
    // console.log("\n");
  }
  console.log("updateStockPrice: Done!!");
}

//*_____________________________________this function will update date & time of all the Stocks
async function updateDateTime(scrapeDate, scrapeTime) {
  const Stock = Parse.Object.extend("Stock");
  const queryStock = new Parse.Query(Stock);

  const stock = await queryStock.findAll();
  console.log("Updating date & time of Stock class..");
  for (let i = 0; i < stock.length; i++) {
    stock[i].set("upDate", scrapeDate);
    stock[i].set("upTime", scrapeTime);
    await stock[i].save().catch(function (error) {
      console.log("updateDateTime error: " + error.message);
      emailTrigger(true);
    });
  }
}

//?________________________________________________________returning as object from Stock class
async function queryForStockObjectId(TRADING_CODE) {
  const Stock = Parse.Object.extend("Stock");
  const queryStock = new Parse.Query(Stock);
  const countObjects = await queryStock.find();

  for (let i = 0; i < countObjects.length; i++) {
    queryStock.equalTo("TRADING_CODE", TRADING_CODE);
    const result = await queryStock.first();
    //console.log(result);
    if (result) return result;
    else {
      console.log("TRADING_CODE not found in 'Stock' class.!!");
      break;
    }
  }
}

//!_____________________________this function inserts new stocks prices into "StockPrice" class
async function insertStockPrice(scrapeDate, scrapeTime, scrapStock) {
  const length = scrapStock.length;
  await updateDateTime(scrapeDate, scrapeTime);

  console.log("Stocks Price inserting..");
  for (let j = 0; j < length; j++) {
    const StockPrice = Parse.Object.extend("StockPrice");
    const stockPrice = new StockPrice();
    for (let i = j; i < j + 1; ) {
      stockPrice.set("TRADING_CODE", scrapStock[j].TRADING_CODE);
      stockPrice.set("LTP", scrapStock[j].LTP);
      stockPrice.set("HIGH", scrapStock[j].HIGH);
      stockPrice.set("LOW", scrapStock[j].LOW);
      stockPrice.set("CLOSEP", scrapStock[j].CLOSEP);
      stockPrice.set("YCP", scrapStock[j].YCP);
      stockPrice.set("CHANGE", scrapStock[j].CHANGE);
      stockPrice.set("TRADE", scrapStock[j].TRADE);
      stockPrice.set("VALUE", scrapStock[j].VALUE);
      stockPrice.set("VOLUME", scrapStock[j].VOLUME);
      const x = await queryForStockObjectId(scrapStock[j].TRADING_CODE);
      stockPrice.set("RELATE_TO", x);
      await stockPrice.save().catch(function (error) {
        console.log("insertStockPrice error: " + error.message);
        emailTrigger(true);
      });
      break;
    }
  }
  console.log("insertStockPrice: Done!!");
}

//!_____________________________this function will decide what to do with the scrapStock prices
async function readDateTime(scrapeDate, scrapeTime, scrapStock) {
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
    updateStockPrice(scrapeTime, scrapStock);
    return 0;
  } else if (upDate != scrapeDate && upTime == scrapeTime) {
    console.log("insertStockPrice: Activated!");
    insertStockPrice(scrapeDate, scrapeTime, scrapStock);
    return 0;
  } else {
    console.log("insertStockPrice: Activated!");
    insertStockPrice(scrapeDate, scrapeTime, scrapStock);
    return 0;
  }
}

//!___________________________________________________________________________the main function
async function main() {
  await request(
    "https://www.dsebd.org/latest_share_price_scroll_l.php",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const sharePrice = [];
        const siteHeading = $(".BodyHead"); //scraping the BodyHead of the file
        const splitHeading = siteHeading.first().text().split(" ");

        const headTitlecheck =
          splitHeading[0] +
          " " +
          splitHeading[1] +
          " " +
          splitHeading[2] +
          " " +
          splitHeading[3];
        //console.log(headChecker);

        if (headTitlecheck == "Latest Share Price On") {
          //Concatenate date & time
          const scrapeDate =
            splitHeading[4] + " " + splitHeading[5] + " " + splitHeading[6];
          const scrapeTime = splitHeading[8] + " " + splitHeading[9];

          $("html>body>div>section>div>div>div>div>div>table>tbody>tr").each(
            (index, element) => {
              //if (index === 0) return true;
              const tds = $(element).find("td");
              //const _NO = $(tds[0]).text().replace(/\s\s+/g, "");
              const TRADING_CODE = $(tds[1]).text().replace(/\s\s+/g, "");
              const _LTP = $(tds[2]).text().replace(/\s\s+/g, "");
              const _HIGH = $(tds[3]).text().replace(/\s\s+/g, "");
              const _LOW = $(tds[4]).text().replace(/\s\s+/g, "");
              const _CLOSEP = $(tds[5]).text().replace(/\s\s+/g, "");
              const _YCP = $(tds[6]).text().replace(/\s\s+/g, "");
              const _CHANGE = $(tds[7]).text().replace(/\s\s+/g, "");
              const _TRADE = $(tds[8]).text().replace(/\s\s+/g, "");
              const _VALUE = $(tds[9]).text().replace(/\s\s+/g, "");
              const _VOLUME = $(tds[10])
                .text()
                .replace(/\s\s+/g, "")
                .replace(/,+/g, "");

              //!converting string to float
              //var NO = parseInt(_NO, 10);
              var LTP = parseFloat(_LTP);
              var HIGH = parseFloat(_HIGH);
              var LOW = parseFloat(_LOW);
              var CLOSEP = parseFloat(_CLOSEP);
              var YCP = parseFloat(_YCP);
              var CHANGE = parseFloat(_CHANGE);
              var TRADE = parseFloat(_TRADE);
              var VALUE = parseFloat(_VALUE);
              var VOLUME = parseFloat(_VOLUME);

              const tableRow = {
                //NO,
                TRADING_CODE,
                LTP,
                HIGH,
                LOW,
                CLOSEP,
                YCP,
                CHANGE,
                TRADE,
                VALUE,
                VOLUME,
              };
              sharePrice.push(tableRow);
            }
          );
          console.log(
            "\n                                " +
              " Date: " +
              scrapeDate +
              "  Time: " +
              scrapeTime
          );
          console.table(sharePrice);
          // readDateTime(scrapeDate, scrapeTime, sharePrice);
        } else {
          console.log(
            "There was an error while web scraping COVID19 Data. Please check your JavaScript running @ RPi4\n"
          );
          //emailTrigger(true);
        }
      } else {
        console.log(error);
      }
    }
  );
}

main();
