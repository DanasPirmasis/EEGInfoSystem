import React, { useRef, useEffect, useState } from 'react';
import useResizeObserver from './useResizeObserver';
import {
	select,
	scaleLinear,
	line,
	min,
	max,
	axisBottom,
	axisLeft,
	zoom,
	drag,
} from 'd3';
import './TestChart.css';

const ZoomableLineChart = (props) => {
	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	const [currentZoomState, setCurrentZoomState] = useState();
	const [selectedDataRange, setSelectedDataRange] = useState([0, 1000]);
	const [selectedData, setSelectedData] = useState(props.data.slice(0, 1000));

	// const dataUpdater = () => {
	// 	if (currentZoomState) {
	// 		//console.log(props.data);
	// 		//console.log({ selectedData });
	// 		const { width } =
	// 			dimensions || wrapperRef.current.getBoundingClientRect();
	// 		let valuesToWidthZoomRatio =
	// 			selectedData.length / (width * (currentZoomState.k - 1));

	// 		if (valuesToWidthZoomRatio < 1) valuesToWidthZoomRatio += 1;

	// 		let startValue = Math.abs(
	// 			Math.ceil(currentZoomState.x / valuesToWidthZoomRatio)
	// 		);
	// 		let endValue = startValue + 1000;
	// 		// console.log({ valuesToWidthZoomRatio });
	// 		// console.log({ currentZoomState });
	// 		// console.log({ startValue });
	// 		// console.log({ endValue });
	// 		setSelectedDataRange([startValue, endValue]);
	// 		setSelectedData(props.data.slice(startValue, endValue));
	// 	}
	// };
	//data should always show 1k data points, aka be stable and not fuck up when zooming and start showing too few
	// const flattenAndSubtract = (firstSignal, secondSignal) => {
	// 	let firstSignalData = props.data._physicalSignals[firstSignal];
	// 	let secondSignalData = props.data._physicalSignals[secondSignal];
	// 	let derivation = [];

	// 	for (let i = 0; i < firstSignalData.length; i++) {
	// 		for (let j = 0; j < firstSignalData[i].length; j++) {
	// 			derivation.push(secondSignalData[i][j] - firstSignalData[i][j]);
	// 		}
	// 	}
	// 	console.log(derivation);
	// 	return derivation;
	// };
	useEffect(() => {
		//console.log(selectedDataRange);
		const svg = select(svgRef.current);
		const svgContent = svg.select('.content');
		const { width, height } =
			dimensions || wrapperRef.current.getBoundingClientRect();
		const xScale = scaleLinear().domain(selectedDataRange).range([0, width]);

		if (currentZoomState) {
			const newXScale = currentZoomState.rescaleX(xScale);
			xScale.domain(newXScale.domain());
		}

		const yScale = scaleLinear()
			.domain([min(selectedData), max(selectedData)])
			.range([height, 10]);

		const lineGenerator = line()
			.x((d, index) => xScale(index))
			.y((d) => yScale(d));

		// render the line
		svgContent
			.selectAll('.myLine')
			.data([selectedData])
			.join('path')
			.attr('class', 'myLine')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 1, 5)
			.attr('fill', 'none')
			.attr('d', lineGenerator);

		// axes
		const xAxis = axisBottom(xScale);
		svg
			.select('.x-axis')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);

		const yAxis = axisLeft(yScale);
		svg.select('.y-axis').call(yAxis);

		// zoom
		const zoomBehavior = zoom()
			.scaleExtent([1, 100])
			.translateExtent([
				[0, 0],
				[width, height],
			])
			.on('zoom', (event) => {
				const zoomState = event.transform;
				setCurrentZoomState(zoomState);
				//console.log(props.data);
				//console.log({ selectedData });
				const { width } =
					dimensions || wrapperRef.current.getBoundingClientRect();
				let valuesToWidthZoomRatio =
					selectedData.length / (width * (currentZoomState.k - 1));

				if (valuesToWidthZoomRatio < 1) valuesToWidthZoomRatio += 1;

				let startValue = Math.abs(
					Math.ceil(currentZoomState.x / valuesToWidthZoomRatio)
				);
				let endValue = startValue + 1000;
				// console.log({ valuesToWidthZoomRatio });
				// console.log({ currentZoomState });
				// console.log({ startValue });
				// console.log({ endValue });
				setSelectedDataRange([0, endValue]);
				setSelectedData(props.data.slice(0, endValue));
				//console.log(selectedData);
			});

		// const dragBehavior = drag()
		// 	.origin(() => {
		// 		return { x: 0, y: 0 };
		// 	})
		// 	.on('drag', dragmove)
		// 	.on('dragstart', dragstart)
		// 	.on('dragend', dragend);

		svg.call(zoomBehavior);
	}, [currentZoomState, dimensions]);

	return (
		<React.Fragment>
			<div ref={wrapperRef} className={'svgDiv'}>
				<svg className={'svg1'} ref={svgRef}>
					<defs>
						<clipPath id={'chart1'}>
							<rect x="0" y="0" width="100%" height="100%" />
						</clipPath>
					</defs>
					<g className="content" clipPath={`url(#${'chart1'})`}></g>
					<g className="x-axis" />
					<g className="y-axis" />
				</svg>
			</div>
		</React.Fragment>
	);
};

export default ZoomableLineChart;
