import React from "react";
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = React.useState(null);
  const raw = `
  query{
    statistics{
        state
        total_cases
        total_death
        new_death
        new_case
        submission_date
    }
  }`


  React.useEffect(() => {
    fetch("/stats", {
      method: 'post',
      headers: {'Content-Type':'application/graphql'},
      body: raw
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data.data.statistics[0].state)
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
