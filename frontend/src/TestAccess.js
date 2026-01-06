import React, { useState } from "react";

function TestAccess() {
  const [dataType, setDataType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [result, setResult] = useState("");

  const testAccess = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/data/${dataType}?purpose=${purpose}`
      );

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult("Error testing access");
    }
  };

  return (
    <div>
      <h2>Test Data Access</h2>

      <input
        placeholder="Data type (email, phone, location...)"
        value={dataType}
        onChange={(e) => setDataType(e.target.value)}
      />

      <input
        placeholder="Purpose (marketing, analytics...)"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />

      <br />
      <button onClick={testAccess}>Test Access</button>

      {result && (
        <pre style={{ background: "#eee", padding: "10px" }}>
          {result}
        </pre>
      )}
    </div>
  );
}

export default TestAccess;
