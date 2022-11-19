import React, { Component } from "react";
import Plot from 'react-plotly.js'

class ChoroplethMap extends Component {

	// Set up states for loading data
	constructor(props){
		super(props);
		this.state ={ data: [],
			total_cases: [],
			total_death: [],
		states: [],
		year: [],
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
				var total_death = []
				var year = []
				var i = 0
				var ignore = resJson.data.filteredStats.filter(x=>{
					states.push(x.state)
					total_cases.push(x.total_cases)
					total_death.push(x.total_death)
					year.push(new Date(x.submission_date).getFullYear() + i)
					i++
				})
				this.setState( {total_cases: total_cases,
				states: states,
				total_death: total_death,
			year: year} )
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

	sliderChange(event){
		try {
			console.log(event);			
		} catch (error) {
			console.log(error);
		}
	}

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
							//    geo:{
							// 	scope: 'usa',
							// 	showlakes: true,
							// 	lakecolor: 'rgb(255,255,255)'
							// }
						}
						]}
					layout = {{
						title: '1990 US Agriculture Exports by State',
						geo:{
						  scope: 'usa',
						  showlakes: true,
						  lakecolor: 'rgb(255,255,255)'
						},
						xaxis: {autorange: false},
						yaxis: {autorange: false},
						sliders: [{
						  currentvalue: {
							prefix: 'Year: ',
						  },
						  steps: this.state.year.map(f => ({
							label: f,
							method: 'animate',
							args: [[f], {frame: {duration: 0}}]
						  }))
						}]
					  }
					}
					onSliderChange = {
						// this.sliderChange()
						(e)=>{
							// console.log(e.step.value);
							// console.log(e);
							if (Number(e.step.value) % 2 == 0) {
								
								console.log('Value is even');							
								// console.log(this.context);
							} else {
								console.log('Value is odd');							
							}
							// Plot.
						}
					}
					  
				 />
			</div>
		)
	}
}

export default ChoroplethMap;