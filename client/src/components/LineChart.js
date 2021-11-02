import { useRef } from 'react';
import * as d3 from 'd3';
import './LineChart.css';

const LineChart = (props) => {
	const d3Chart = useRef();
	const margin = { top: 10, right: 30, bottom: 40, left: 60 };
	const width = window.innerWidth * 0.5 - margin.left - margin.right;
	const height = window.innerHeight * 0.5 - margin.top - margin.bottom;

	const svg = d3
		.select(d3Chart.current)
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	//X Axis
	const x = d3.scaleLinear().domain([0, props.data.length]).range([0, width]);
	svg
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x));

	//Y Axis
	const y = d3
		.scaleLinear()
		.domain([d3.min(props.data), d3.max(props.data)])
		.range([height, 0]);

	svg.append('g').call(d3.axisLeft(y));
	let testObj = [];

	for (let i = 0; i < props.labels.length; i++) {
		testObj.push({ data: props.data[i], label: i });
	}
	console.log(testObj);
	svg
		.append('path')
		.datum(testObj)
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 1, 5)
		.attr(
			'd',
			d3
				.line()
				.x((d) => {
					return x(d.label);
				})
				.y((d) => {
					return y(d.data);
				})
		);
	svg
		.append('text')
		.attr('x', width / 2)
		.attr('y', height + margin.bottom - 10)
		.attr('text-anchor', 'middle')
		.attr('font-size', '16px')
		.attr('fill', 'steelblue')
		.text('0,0 PhysicalSignal');

	return (
		<div className="test">
			<svg ref={d3Chart}></svg>
		</div>
	);
};

export default LineChart;
