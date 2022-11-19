import React, { Component } from "react";
import Plot from 'react-plotly.js'

class ChoroplethMap extends Component {

	// Set up states for loading data
	constructor(props){
		super(props);
		this.state ={ data: [],
			total_cases: [],
		states: [],
	 }
	}

	// Call API upon component mount
	componentDidMount() {
		// const endpoint = "https://data.cityofnewyork.us/resource/rc75-m7u3.json";

		// fetch(endpoint)
		// 	.then(response => response.json())
		// 	.then(data => {
		// 		this.setState( {data: data} )
		// 	})
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
		fetch("/filtered-stats", {
			method: 'post',
			headers: {'Content-Type':'application/graphql'},
			body: raw
		  })
			.then((res) => res.json())
			.then((resJson) => {
				console.log(resJson);		
				var states = []
				var total_cases = []
				var ignore = resJson.data.filteredStats.filter(x=>{
					states.push(x.state)
					total_cases.push(x.total_cases)
				})
				this.setState( {total_cases: total_cases,
				states: states} )
			  }).catch(err => console.log(err));			
	}

	// Change data structure
	// transformData (data) {
	// 	let plot_data = [];

	// 	let x = [];
	// 	let y = [];
	// 	data.map(each => {
	// 		x.push(each.date_of_interest)
	// 		y.push(each.case_count)
	// 	})
	// 	plot_data['x'] = x;
	// 	plot_data['y'] = y;

	// 	console.log(plot_data)

	// 	return plot_data
	// }

	render() {
		return (
			<div>
				<Plot
					data = {[
							// {type: 'scatter',
							//  mode: 'lines',
							//  x: this.transformData(this.state.data)['x'],
							//  y: this.transformData(this.state.data)['y'],
							//  marker: { color: '#ed022d'}}
							{
								type: "choropleth", 
								name: "USA-states",
								locations: this.state.states,
								locationmode: 'USA-states',
							   z: this.state.total_cases,
							   zmin: Math.min(this.state.total_cases), 
							   zmax: Math.max(this.state.total_cases), 
							   geo:{
								scope: 'usa',
								showlakes: true,
								lakecolor: 'rgb(255,255,255)'
							}
						}
						]}
					layout = { {width: 1000, height: 500, title: 'Covid Case Count'} }
				 />
			</div>
		)
	}
}

export default ChoroplethMap;