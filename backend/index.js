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
