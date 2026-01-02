const DATA_TYPES = {
  email: ["email", "mail"],
  phone: ["phone", "mobile"],
  location: ["location", "gps"],
  profile: ["profile", "personal data"]
};

const PURPOSES = {
  marketing: ["marketing", "promotion"],
  support: ["support", "customer service"],
  analytics: ["analytics", "analysis"],
  transactional: ["transactional", "billing"],
  personalization: ["personalization", "recommendation"]
};

function parseConsent(text) {
  const lower = text.toLowerCase();
  const result = {};

  for (let type in DATA_TYPES) {
    if (DATA_TYPES[type].some(word => lower.includes(word))) {
      result.data_type = type;
    }
  }

  for (let purpose in PURPOSES) {
    if (PURPOSES[purpose].some(word => lower.includes(word))) {
      result.purpose = purpose;
    }
  }

  const match = lower.match(/(\d+)\s*(month|months|year|years)/);
  if (match) {
    const expiry = new Date();
    if (match[2].includes("year")) {
      expiry.setFullYear(expiry.getFullYear() + Number(match[1]));
    } else {
      expiry.setMonth(expiry.getMonth() + Number(match[1]));
    }
    result.expires_at = expiry;
  } else {
    result.expires_at = null;
  }

  return result;
}

module.exports = parseConsent;
