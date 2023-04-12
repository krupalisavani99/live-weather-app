import "./App.css";
import React from "react";
import Weather from "./components/currentLocation";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <React.Fragment>
      <Weather />
      <div className="footer-info">Developed by Krupali Savani</div>
    </React.Fragment>
  );
}

export default App;
