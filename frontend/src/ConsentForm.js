import React, { useState } from "react";

function ConsentForm() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState(null);

  const submitConsent = async () => {
    const res = await fetch("http://localhost:3000/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="card">
      <h2>Submit Legal Consent</h2>

      <textarea
        rows="4"
        placeholder="Enter legal consent text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={submitConsent}>Submit Consent</button>

      {response && (
        <div className="result-box">
          <h4>Parsed Consent</h4>
          <pre>{JSON.stringify(response.parsed, null, 2)}</pre>

          <h4>Generated Policy</h4>
          <pre>{JSON.stringify(response.policy, null, 2)}</pre>

          <h4>Readable Consent</h4>
          <p className="success">{response.readableConsent}</p>
        </div>
      )}
    </div>
  );
}

export default ConsentForm;
