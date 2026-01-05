const express = require("express");
const cors = require("cors");
const pool = require("./db");
const parseConsent = require("./parser/consentParser");
const generatePolicy = require("./policy/policyGenerator");
const consentEnforcer = require("./middleware/consentEnforcer");

const app = express();
app.use(cors());
app.use(express.json());

// CONSENT SUBMISSION API
app.post("/consent", async (req, res) => {
  try {
    const { text } = req.body;

    const parsed = parseConsent(text);
    if (!parsed.data_type || !parsed.purpose) {
  return res.status(400).json({
    error: "Unable to parse consent text. Unsupported data type or purpose."
  });
}
    const policy = generatePolicy(parsed);

    const consentRes = await pool.query(
      "INSERT INTO consents (original_text) VALUES ($1) RETURNING id",
      [text]
    );

const parsedRes = await pool.query(
  "INSERT INTO parsed_consents (consent_id, data_type, purpose, expires_at) VALUES ($1,$2,$3,$4) RETURNING id",
  [
    consentRes.rows[0].id,
    parsed.data_type,
    parsed.purpose,
    parsed.expires_at
  ]
);


    await pool.query(
      "INSERT INTO policies (parsed_consent_id, effect, expires_at) VALUES ($1,$2,$3)",
      [parsedRes.rows[0].id, policy.effect, policy.expires_at]
    );

    res.json({ message: "Consent stored successfully", parsed, policy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔐 PROTECTED DATA ACCESS API
app.get("/data/:type", consentEnforcer, (req, res) => {
  res.json({
    message: `Access granted for ${req.params.type}`
  });
});

// 5️⃣ SERVER START (ALWAYS LAST)
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
