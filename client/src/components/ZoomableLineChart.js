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
} from 'd3';

import './Chart.css';

const ZoomableLineChart = (props) => {
	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	const [currentZoomState, setCurrentZoomState] = useState();
	const [dimensionState, setDimensionState] = useState(dimensions);

	useEffect(() => {
		//Weird way to update parent component ticks
		// if (props.data !== selectedData) {
		// 	//setDimensionState(dimensions);
		// 	props.dimensionCallback(dimensions);
		// }
		const svg = select(svgRef.current);
		const svgContent = svg.select('.content');
		const { width, height } =
			dimensions || wrapperRef.current.getBoundingClientRect();

		const xScale = scaleLinear()
			.domain([0, props.data.length])
			.range([0, width]);

		const yScale = scaleLinear().domain([-2000, 2000]).range([height, 10]);

		if (currentZoomState) {
			//const newXScale = currentZoomState.rescaleX(xScale);
			const newYScale = currentZoomState.rescaleY(yScale);
			//xScale.domain(newXScale.domain());
			yScale.domain(newYScale.domain());
		}

		const lineGenerator = line()
			.x((d, index) => xScale(index))
			.y((d) => yScale(d));

		// render the line
		svgContent
			.selectAll('.myLine')
			.data([props.data])
			.join('path')
			.attr('class', 'myLine')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 1, 5)
			.attr('fill', 'none')
			.attr('d', lineGenerator);

		// axes
		let tickValues = [];

		for (let i = 0; i < props.data.length; i = i + 128) {
			if (i !== 0) {
				tickValues.push(i - 1);
			} else {
				tickValues.push(i);
			}
		}

		const xAxis = axisBottom(xScale)
			.tickSize(-height)
			.tickFormat('')
			.tickValues(tickValues);

		svg
			.select('.grid')
			.attr('class', 'grid')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis);

		const yAxis = axisLeft(yScale)
			.tickSize(-width)
			.tickFormat((index) => index + ' uV');
		svg.select('.y-axis').call(yAxis);

		// zoom
		const zoomBehavior = zoom()
			.scaleExtent([0.1, 100])
			.translateExtent([
				[0, 0],
				[width, height],
			])
			.on('zoom', (event) => {
				const zoomState = event.transform;
				setCurrentZoomState(zoomState);
			});
		svg.call(zoomBehavior);
	}, [currentZoomState, dimensions, props.data]);

	return (
		<React.Fragment>
			<div ref={wrapperRef} className={'svgDiv'}>
				<svg
					className={'svg1'}
					style={{ height: 100 / props.numberOfSignals + 'vh' }}
					ref={svgRef}
				>
					<defs>
						<clipPath id={'chart1'}>
							<rect x="0" y="0" width="100%" height="100%" />
						</clipPath>
					</defs>
					<g className="content" clipPath={`url(#${'chart1'})`}></g>
					<g className="grid" />
					<g className="y-axis" />
				</svg>
			</div>
		</React.Fragment>
	);
};

export default ZoomableLineChart;
