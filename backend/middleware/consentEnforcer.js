const pool = require("../db");
const logDecision = require("../logger/auditLogger");

async function consentEnforcer(req, res, next) {
  const dataType = req.params.type;
  const purpose = req.query.purpose;

  const result = await pool.query(
    `SELECT p.id as policy_id, p.expires_at
     FROM policies p
     JOIN parsed_consents pc ON p.parsed_consent_id = pc.id
     WHERE pc.data_type=$1 AND pc.purpose=$2`,
    [dataType, purpose]
  );

  //  NO CONSENT FOUND
  if (result.rows.length === 0) {
    logDecision({
      data_type: dataType,
      purpose,
      decision: "DENY",
      reason: "No matching consent",
      timestamp: new Date()
    });

    return res.status(403).json({ message: "Consent not found" });
  }

  const policy = result.rows[0];

  //  CONSENT EXPIRED
  if (policy.expires_at && new Date(policy.expires_at) < new Date()) {
    logDecision({
      data_type: dataType,
      purpose,
      decision: "DENY",
      reason: "Consent expired",
      policy_id: policy.policy_id,
      timestamp: new Date()
    });

    return res.status(403).json({ message: "Consent expired" });
  }

  //  CONSENT ALLOWED
  logDecision({
    data_type: dataType,
    purpose,
    decision: "ALLOW",
    policy_id: policy.policy_id,
    timestamp: new Date()
  });

  next();
}

module.exports = consentEnforcer;
