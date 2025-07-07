import React from "react";
import Hero from "./components/hero";
import Navbar from "./components/navbar";
import Historial from "./components/historial";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      {<Historial />}
    </div>
  );
}

export default App;