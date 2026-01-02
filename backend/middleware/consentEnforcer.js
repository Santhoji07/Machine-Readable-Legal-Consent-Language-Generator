const pool = require("../db");

async function consentEnforcer(req, res, next) {
  const dataType = req.params.type;
  const purpose = req.query.purpose;

  const result = await pool.query(
    `SELECT p.effect, p.expires_at
     FROM policies p
     JOIN parsed_consents pc ON p.parsed_consent_id = pc.id
     WHERE pc.data_type=$1 AND pc.purpose=$2`,
    [dataType, purpose]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({ message: "Consent not found" });
  }

  const policy = result.rows[0];

  if (policy.expires_at && new Date(policy.expires_at) < new Date()) {
    return res.status(403).json({ message: "Consent expired" });
  }

  next();
}

module.exports = consentEnforcer;
