const express = require("express");
const cors = require("cors");
const pool = require("./db");
const parseConsent = require("./parser/consentParser");
const generatePolicy = require("./policy/policyGenerator");
const consentEnforcer = require("./middleware/consentEnforcer");
const ruleToText = require("./translator/ruleToText");

const app = express();
app.use(cors());
app.use(express.json());

// CONSENT SUBMISSION API
app.post("/consent", async (req, res) => {
  try {
    const { text } = req.body;

    // 1️⃣ Parse legal text
    const parsed = parseConsent(text);

    if (!parsed.data_type || !parsed.purpose) {
      return res.status(400).json({
        error: "Unable to parse consent text. Unsupported data type or purpose."
      });
    }

    // 3️⃣ Generate policy
    const policy = generatePolicy(parsed);

    // 4️⃣ Bidirectional translation (NEW)
    const readableConsent = ruleToText(policy);

    // 5️⃣ Store original consent
    const consentRes = await pool.query(
      "INSERT INTO consents (original_text) VALUES ($1) RETURNING id",
      [text]
    );

    // 6️⃣ Store parsed consent
    const parsedRes = await pool.query(
      "INSERT INTO parsed_consents (consent_id, data_type, purpose, expires_at) VALUES ($1,$2,$3,$4) RETURNING id",
      [
        consentRes.rows[0].id,
        parsed.data_type,
        parsed.purpose,
        parsed.expires_at
      ]
    );

    // 7️⃣ Store policy
    await pool.query(
      "INSERT INTO policies (parsed_consent_id, effect, expires_at) VALUES ($1,$2,$3)",
      [parsedRes.rows[0].id, policy.effect, policy.expires_at]
    );

    // 8️⃣ 👉 SEND RESPONSE (THIS IS THE PART YOU ASKED ABOUT)
    res.json({
      message: "Consent stored successfully",
      parsed,
      policy,
      readableConsent
    });

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

// 5️⃣ SERVER START 
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
