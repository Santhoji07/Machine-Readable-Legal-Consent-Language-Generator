import React, { useState } from "react";

function TestAccess() {
  const [dataType, setDataType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [result, setResult] = useState(null);

  const testAccess = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/data/${dataType}?purpose=${purpose}`
      );
      const data = await res.json();
      setResult(data.message || JSON.stringify(data));
    } catch {
      setResult("Error testing access");
    }
  };

  return (
    <div className="card">
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

      <button onClick={testAccess}>Test Access</button>

      {result && (
        <div className="result-box">
          <p
            className={
              result.toLowerCase().includes("granted") ? "success" : "error"
            }
          >
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

export default TestAccess;
