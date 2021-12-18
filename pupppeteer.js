const puppeteer = require("puppeteer");
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  dateText: { type: String, unique: false, required: true },
  year: { type: Number, unique: false, required: true },
  typeName: { type: String, unique: false, required: true },
  text: { type: String, unique: true, required: true },
});

const History = mongoose.model("History", Schema); 

mongoose.connect(
  "mongodb+srv://yasin:yasin123@today-in-history.wske3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority  ",
  (err) => console.log(err ? err : "Mongo connected.")
);

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
    var url = date.getUTCDate() + "_" + monthNames[date.getMonth()];
    await page.goto(`https://tr.wikipedia.org/wiki/${url}#Olaylar`);

    try {
      var historyDataList = await page.evaluate(() => {
        var data = [];

        const ulList = $("#Olaylar").parent().nextAll("ul");
        const dayAndMonth = $("#firstHeading").text().trim();

        var title = "";
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

      historyDataList.forEach((element) => {
        const history = new History(element);
        history.save();
      });

      console.log(url);
    } catch (e) {
      console.log(e);
      await browser.close();
      break;
    }
  }

  await browser.close();
  console.clear();
  console.log("BİTTİ");

})();
