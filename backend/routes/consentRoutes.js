const express = require("express");
const router = express.Router();
const pool = require("../db");
const parseConsent = require("../parser/consentParser");
const generatePolicy = require("../policy/policyGenerator");

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    const parsed = parseConsent(text);
    const policy = generatePolicy(parsed);
    const readableConsent = ruleToText(policy);


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

module.exports = router;
