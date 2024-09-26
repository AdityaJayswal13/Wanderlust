const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
};

const initDB = async() => {
    try {
      await Listing.deleteMany({});
      initData.data=initData.data.map((obj)=>({...obj,owner:"66ef8164dea5e24b5b72b1e3"}));
      await Listing.insertMany(initData.data);
      console.log("Data was successfully initialized");
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };
initDB();

