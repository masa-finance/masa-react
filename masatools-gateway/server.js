const axios = require("axios");

const express = require("express");
var cors = require("cors");
var app = express();

const URL = "https://xiwvhk0ca8.execute-api.us-east-1.amazonaws.com/fin/";

const headers = {
  "x-api-key": "NN7ARbtuBy68bM78xQHFy3YDmLbUIPl676COm6Qa",
};

app.use(
  cors({
    origin: "https://masatools.finance:6006",
    "Access-Control-Allow-Origin": "https://masatools.finance:6006",
  })
);

app.get("/*", async function (req, res, next) {
  const s = await axios(`${URL}${req.path}`, { headers: headers });
  res.json(s.data);
});

app.listen(3000, () => {
  console.log(`Express app listening at http://localhost:${3000}`);
});
