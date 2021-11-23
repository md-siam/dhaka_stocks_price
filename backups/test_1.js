const { emailTrigger } = require("../emailtrigger.js");
const request = require("request");
const cheerio = require("cheerio");
const cron = require("node-cron");

//? Schedule tasks to be run on the server
// cron.schedule("* * * * *", function () {
//   console.log("running a task every minute");
//
// });

async function main() {
  await request(
    "https://www.dsebd.org/latest_share_price_scroll_l.php",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const siteHeading = $(".BodyHead");
        const splitHeading = siteHeading.first().text().split(" ");
        //console.log(splitHeading);

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
          console.log("\nScrape date: " + scrapeDate);
          console.log("Scrape time: " + scrapeTime + "\n");
        } else {
          // console.log(
          //   "There was an error while web scraping COVID19 Data. Please check your JavaScript running @ RPi4\n"
          // );
          emailTrigger(true);
        }
      } else {
        console.log(error);
      }
    }
  );
}

main();
