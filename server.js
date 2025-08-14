const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const connectDB = require("./config/dbConfig");
const router = require("./routes/router");
const customerRoutes = require("./routes/customerRoutes");
const path = require("path");

//connect to database
connectDB();

app.use("/Images", express.static(path.join(__dirname, "Images")));
// Use JSON middleware to parse incoming requests with JSON payload
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.use("/", router);
app.use("/", customerRoutes);

app.listen(port, () => console.log(`server is running on port ${port}`));
