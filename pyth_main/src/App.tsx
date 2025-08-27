import React from 'react';
import Calculator from './components/Calculator';
import Graph from './components/Graph';
import InputPanel from './components/InputPanel';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Graphing Calculator</h1>
      </header>
      <main className="App-main">
        <div className="calculator-container">
          <InputPanel />
          <Calculator />
        </div>
        <div className="graph-container">
          <Graph />
        </div>
      </main>
    </div>
  );
}

export default App;
