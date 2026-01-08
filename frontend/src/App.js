import React from "react";
import ConsentForm from "./ConsentForm";
import TestAccess from "./TestAccess";
import "./App.css";

function App() {
  return (
    <div className="container">
      <h1>Consent Management System</h1>

      <ConsentForm />
      <TestAccess />
    </div>
  );
}

export default App;
