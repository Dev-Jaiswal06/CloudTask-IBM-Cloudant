const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cloudant = require("./cloudant");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);

async function checkConnection() {
    try {
        const result = await cloudant.getDatabaseInformation({
            db: process.env.DB_NAME,
        });

        console.log("✅ Cloudant Connected");
        console.log(result.result);
    } catch (err) {
        console.log("❌ Connection Failed");
        console.log(err.message);
    }
}

checkConnection();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});