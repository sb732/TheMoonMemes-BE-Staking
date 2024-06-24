const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const stakingRoutes = require("./routes/stakingRoutes");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/stakingDB");

app.use(bodyParser.json());
app.use("/api", stakingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
