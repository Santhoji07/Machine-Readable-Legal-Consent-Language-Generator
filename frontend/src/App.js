import React from "react";
import ConsentForm from "./ConsentForm";
import TestAccess from "./TestAccess";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Consent Management System</h1>

      <ConsentForm />
      <hr />
      <TestAccess />
    </div>
  );
}

export default App;
