const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

app.get("/jobs", (req, res) => res.json(readDB().jobs));
app.get("/categories", (req, res) => res.json(readDB().categories));
app.get("/testimonials", (req, res) => res.json(readDB().testimonials));

app.post("/applications", (req, res) => {
  try {
    const db = readDB();
    const newApp = { id: Date.now().toString(), ...req.body };
    db.applications.push(newApp);
    writeDB(db);
    res.status(201).json(newApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
