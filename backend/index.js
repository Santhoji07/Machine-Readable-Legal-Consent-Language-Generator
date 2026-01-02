const express = require("express");
const cors = require("cors");
const pool = require("./db");
const parseConsent = require("./parser/consentParser");
const generatePolicy = require("./policy/policyGenerator");
const consentEnforcer = require("./middleware/consentEnforcer");
const consentRoutes = require("./routes/consentRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/consent", consentRoutes);

//Protected API (DATA ACCESS)
app.get("/data/:type", consentEnforcer, (req, res) => {
  res.json({ message: `Access granted for ${req.params.type}` });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
