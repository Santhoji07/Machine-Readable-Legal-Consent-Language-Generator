function ruleToText(policy) {
  if (!policy) return "No policy available.";

  let text = `The user's ${policy.data_type} data can be used for ${policy.purpose}`;

  if (policy.expires_at) {
    const date = new Date(policy.expires_at).toDateString();
    text += ` until ${date}.`;
  } else {
    text += " with no expiration.";
  }

  return text;
}

module.exports = ruleToText;
