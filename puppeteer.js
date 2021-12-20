const puppeteer = require("puppeteer");

require("./db")();
var history = require("./models/history");

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 20,
  });

  const page = await browser.newPage();

  for (
    var d = new Date(2021, 0, 1);
    d <= new Date(2022, 0, 1);
    d.setDate(d.getDate() + 1)
  ) {
    var date = new Date(d);
    var url = date.getDate() + "_" + monthNames[date.getMonth()];
    await page.goto(`https://tr.wikipedia.org/wiki/${url}#Olaylar`);

    try {
      var historyDataList = await page.evaluate(() => {
        var data = [];

        const ulList = $("#Olaylar").parent().nextAll("ul");
        const dayAndMonth = $("#firstHeading").text().trim();

        var title = "Olaylar";
        $.each(ulList, (index, value) => {
          const titleProp = $(value).prev();
          const h2 = $("span.mw-headline", titleProp).text();

          if (h2 !== "") {
            title = h2;
            $.each($(value).children(), (index, item) => {
              var year = $(item).children().first().text();
              const dateText = dayAndMonth + " " + year;
              if (parseInt(year) > 0) {
                data.push({
                  typeName: title,
                  year: parseInt(year),
                  dateText: dateText,
                  text: $(item)
                    .text()
                    .replace(year + " - ", "")
                    .trim(),
                });
              }
            });
          } else {
            $.each($(value).children(), (index, item) => {
              var year = $(item).children().first().text();
              const dateText = dayAndMonth + " " + year;
              if (parseInt(year) > 0) {
                data.push({
                  typeName: title,
                  year: parseInt(year),
                  dateText: dateText,
                  text: $(item)
                    .text()
                    .replace(year + " - ", "")
                    .trim(),
                });
              }
            });
          }
        });

        return data;
      }, {});

      
      try {
        await history.insertMany(historyDataList);
      } catch (err) {
        console.error(err);
      }

    } catch (e) {
      // console.log(e);
      await browser.close();
      break;
    }
  }

  await browser.close();
  // console.clear();
  console.log("BİTTİ");
})();
