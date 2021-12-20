var mongoose = require("mongoose");
const url = "mongodb+srv://yasin:yasin123@today-in-history.wske3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = () => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("open", () => {
    console.log("MongoDB: Connected");
  });
  mongoose.connection.on("error", (err) => {
    console.log("MongoDB: Error", err);
  });

  mongoose.Promise = global.Promise;
};
