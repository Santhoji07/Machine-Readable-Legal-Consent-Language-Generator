function logDecision(log) {
  // This simulates sending logs to OpenSearch
  console.log("AUDIT_LOG:", JSON.stringify(log, null, 2));
}

module.exports = logDecision;
