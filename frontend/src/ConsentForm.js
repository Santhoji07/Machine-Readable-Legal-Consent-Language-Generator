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
    <div>
      <h2>Submit Legal Consent</h2>

      <textarea
        rows="4"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter legal consent text..."
      />

      <br />
      <button onClick={submitConsent}>Submit Consent</button>

      {response && (
        <pre style={{ background: "#eee", padding: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default ConsentForm;
