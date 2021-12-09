/**
 * * Database connection
 */

const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;

/**
 * ! 1.Below is the DB Connection.
 * ! 2.We connecting mongoose.connect and pass MONGO_DB url.
 * ! 3.Handle the response for DB Connection.
 */

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB CONNECTED"))
    .catch((error) => {
      console.log("DB CONNECTION FAILED");
      console.log(error);
      process.exit(1);
    });
};
