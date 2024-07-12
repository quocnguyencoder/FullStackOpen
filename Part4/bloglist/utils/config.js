require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV !== "production"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

console.log("🚀 ~ ENV:", process.env.NODE_ENV);
module.exports = {
  PORT,
  MONGODB_URI,
};
