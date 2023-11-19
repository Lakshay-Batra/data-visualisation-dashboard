const express = require("express");
const data = require("./dummy-data");
const app = express();
const port = process.env.PORT || 3001;

app.get("/api/data", (req, res) => {
  // Replace this with your actual data or connect to a database
  const dataResponse = data;
  res.json(dataResponse);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
