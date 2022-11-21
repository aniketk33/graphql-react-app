import React, { Component, useState } from "react";
import Plot from 'react-plotly.js'
import './ChoroplethMap.css'

class ChoroplethMap extends Component {

	// Set up states for loading data
	constructor(props){
		super(props);
		this.state ={ 
			data: [],
			totalCases: [],
			totalDeaths: [],
			newCases: [],
			newDeaths: [],
			states: [],
			dateList: [],
			zAxisData: [],
			statisticsJsonData: [],
			dropdownValue: 'totalCases',
			options: [
				{ label: 'Total cases', value: 'totalCases'   },
				{ label: 'Total deaths', value: 'totalDeaths' },
				{ label: 'New cases', value: 'newCases' },
				{ label: 'New deaths', value: 'newDeaths' },			  
			  ]
		}
	}
	
	  
	handleChange = (event) =>{
		this.setState({ dropdownValue: event.target.value})	
		switch (event.target.value) {
			case 'totalCases':
				this.setState({
					zAxisData: this.state.totalCases
				})
				break;
			
			case 'totalDeaths':
				this.setState({
					zAxisData: this.state.totalDeaths
				})
				break;
			case 'newCases':
				this.setState({
					zAxisData: this.state.newCases
				})
			break;
			case 'newDeaths':
				this.setState({
					zAxisData: this.state.newDeaths
				})
			break;
		
		}
	} 
	  
	
	formatResult (statsList, date){
		var states = []
		var totalCases = []
		var totalDeaths = []
		var newCases = []
		var newDeaths = []
		var filteredList = statsList.filter(x=> x.submission_date == date)
		var ignore = filteredList.filter(x=>{
			states.push(x.state)
			totalCases.push(x.total_cases)
			totalDeaths.push(x.total_death)
			newCases.push(x.new_case)
			newDeaths.push(x.new_death)
			return null
		})
		switch (this.state.dropdownValue) {
			case 'totalCases':
				this.setState({
					zAxisData: totalCases
				})
				break;
			
			case 'totalDeaths':
				this.setState({
					zAxisData: totalDeaths
				})
				break;
			case 'newCases':
				this.setState({
					zAxisData: newCases
				})
				break;
			case 'newDeaths':
				this.setState({
					zAxisData: newDeaths
				})
				break;
		
		}
		this.setState( {
			totalCases,
			states,
			totalDeaths,
			newCases,
			newDeaths
		} )
	}

	// Call API upon component mount
	componentDidMount() {
		const statsInput = `
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
		fetch("/stats", {
				method: 'post',
				headers: {'Content-Type':'application/graphql'},
				body: statsInput
			  })
				.then((res) => res.json())
				.then((resJson) => {
					var dateList = []
					var formattedDateJSON = resJson.data.statistics.filter(x=>{
						x.submission_date = new Date(x.submission_date).toLocaleDateString('en-US')
						dateList.push(x.submission_date)
						return x
					})
					this.setState({
						statisticsJsonData: formattedDateJSON,
						dateList: [...new Set(dateList)],
					})
					this.formatResult( resJson.data.statistics, resJson.data.statistics[0].submission_date)
				}).catch(err => console.log(err));
			}

	render() {

		return (
			<div>
				<div className="dropdown">
					<label> Select value
					<select id="selectOptions" value={this.state.dropdownValue} onChange={this.handleChange}>
						{this.state.options.map((option) => (
							<option value={option.value}>{option.label}</option>
						))}
					</select>
					</label>
				</div>
				<Plot
					data = {[
						{
							type: "choropleth", 
							name: "USA-states",
							locations: this.state.states,
							locationmode: 'USA-states',
							z: this.state.zAxisData,
							zmin: Math.min(this.state.zAxisData), 
							zmax: Math.max(this.state.zAxisData),
						}
					]}
					layout = {{
						title: `Covid-19 Stats (${this.state.options.find(x=> x.value == this.state.dropdownValue).label})`,
						geo:{
						  scope: 'usa',
						  showlakes: true,
						  lakecolor: 'rgb(255,255,255)'
						},
						xaxis: {autorange: false},
						yaxis: {autorange: false},						
						transition: {duration: 500},
						sliders: [{
						  currentvalue: {
							prefix: 'Year: ',
						  },
						  steps: this.state.dateList.map(f => ({
							label: f,
							method: 'immediate',
							args: [[f], {frame: {redraw: false, duration: 500},
							transition: {duration: 500}}]
						  }))
						}],
					  }
					}
					onSliderChange = {(e)=> this.formatResult(this.state.statisticsJsonData, e.step.value)}
					useResizeHandler={true}
			        style={{width: "100%", height: "100%"}}
				 />
			</div>
		)
	}
}

export default ChoroplethMap;