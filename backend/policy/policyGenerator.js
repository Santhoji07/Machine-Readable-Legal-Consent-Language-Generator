function generatePolicy(parsedConsent) {
  return {
    data_type: parsedConsent.data_type,
    purpose: parsedConsent.purpose,
    expires_at: parsedConsent.expires_at,
    effect: "ALLOW"
  };
}

module.exports = generatePolicy;
