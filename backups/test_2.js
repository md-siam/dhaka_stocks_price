const request = require("request-promise");
const cheerio = require("cheerio");

async function main() {
  const result = await request.get(
    "https://www.dsebd.org/latest_share_price_scroll_l.php"
  );
  const $ = cheerio.load(result);
  const sharePrice = [];
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

  //console.log(sharePrice[0]); // index: 0 - 372
  console.table(sharePrice);

  // for (let i = 0; i < 10; i++) {
  //   console.log(sharePrice[i]);
  // }
}
main();
