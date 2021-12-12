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
	const [selectedData, setSelectedData] = useState(props.data);
	const [dimensionState, setDimensionState] = useState(dimensions);

	useEffect(() => {
		setSelectedData(props.data);
		const svg = select(svgRef.current);
		const svgContent = svg.select('.content');
		const { width, height } =
			dimensions || wrapperRef.current.getBoundingClientRect();

		if (dimensions !== dimensionState) {
			setDimensionState(dimensions);
			props.dimensionCallback(dimensions);
		}

		const xScale = scaleLinear()
			.domain([0, selectedData.length])
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
			.data([selectedData])
			.join('path')
			.attr('class', 'myLine')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 1, 5)
			.attr('fill', 'none')
			.attr('d', lineGenerator);

		// axes
		const xAxis = axisBottom(xScale)
			.tickSize(-height)
			.tickFormat('')
			.tickValues([127, 255, 383, 511, 639, 767, 895, 1023]);
		//these values should change when moving
		svg
			.select('.x-axis')
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
	}, [currentZoomState, dimensions, props.data, selectedData]);

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
					<g className="x-axis" />
					<g className="y-axis" />
				</svg>
			</div>
		</React.Fragment>
	);
};

export default ZoomableLineChart;
