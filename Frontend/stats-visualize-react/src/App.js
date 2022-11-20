import React from "react";
import logo from './logo.svg';
import './App.css';
import Plotly from 'react-plotly.js'

import  ChoroplethMap from './ChoroplethMap'


function App() {
  const [data, setData] = React.useState(null);
  const [layout, setLayout] = React.useState(null);
  const [value, setValue] = React.useState('totalCases');
  const raw = `
  query{
    filteredStats(inputDate:"2020-05-05"){        
        state
        total_cases
        total_death
        new_death
        new_case
        submission_date
    }
}`

  // React.useEffect(() => {
    // fetch("/filtered-stats", {
    //   method: 'post',
    //   headers: {'Content-Type':'application/graphql'},
    //   body: raw
    // })
      // .then((res) => res.json())
      // .then((d) => {
        // console.log(d);
    //     var plotData, plotLayout = PrepareData(d)
    //     setData(plotData)
    //     setLayout(plotLayout)
    //     // Plotly.newPlot(document.getElementById('myApp'), data, layout, {showLink: false})        
    //     var myPlot = document.getElementById('myDiv'),
    // x = [1, 2, 3, 4, 5],
    // y = [10, 20, 30, 20, 10],
    // data = [{x:x, y:y, type:'scatter',
    //          mode:'markers', marker:{size:20}
    //         }],
    // layout = {hovermode:'closest',
    //           title:'Click on Points'
    //  };

// Plotly.newPlot('myDiv', data, layout);

      // }).catch(err => console.log(err));
    // }, []);x 

  return (
    <div className="App" >
        <ChoroplethMap/>
    </div>
  );
}

const PrepareData = (statsData)=>{
  var states = []
  var total_cases = []
  var ignore = statsData.data.filteredStats.filter(x=>{
    states.push(x.state)
    total_cases.push(x.total_cases)
  })
  var data = [{
    type: "choropleth", 
    name: "USA-states",
    locations: states,
    locationmode: 'USA-states',
   z: total_cases,
   zmin: Math.min(total_cases), 
   zmax: Math.max(total_cases), 
   geo:{
    scope: 'usa',
    showlakes: true,
    lakecolor: 'rgb(255,255,255)'
}
// colorbar: {
//     title: 'Millions USD',
//     thickness: 0.2
// },
// marker: {
//     line:{
//         color: 'rgb(255,255,255)',
//         width: 2
//     }
// }

}];

var layout = {
  title: '2011 US Agriculture Exports by State'
};

// Plotly.react('myApp', {
//   data: data,
//   layout: layout,
//   config: {showLink: false}
// });
// console.log(states);
// console.log(total_cases);

return (data, layout)
   

}

export default App;
