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
import Draggable from 'react-draggable';
import './TestChart.css';

const ZoomableLineChart = (props) => {
	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	const [currentZoomState, setCurrentZoomState] = useState();
	const [selectedData, setSelectedData] = useState(props.data.slice(0, 1000));

	useEffect(() => {
		const svg = select(svgRef.current);
		const svgContent = svg.select('.content');
		const { width, height } =
			dimensions || wrapperRef.current.getBoundingClientRect();
		const xScale = scaleLinear().domain([0, 1000]).range([0, width]);

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
			});
		svg.call(zoomBehavior);
	}, [currentZoomState, selectedData, dimensions]);

	const changeValues = (e, data) => {
		const x = data.x;
		let ratio = props.data.length / 1300;
		let startValue = x * ratio;
		let endValue = startValue + 1000;
		if (endValue > props.data.length) endValue = props.data.length;
		setSelectedData(props.data.slice(startValue, endValue));
	};

	return (
		<React.Fragment>
			<div
				style={{
					margin: 'auto',
					border: '1px solid black',
					height: '12px',
					width: '99%',
				}}
			>
				<Draggable
					axis="x"
					handle=".handle"
					defaultPosition={{ x: 0, y: 0 }}
					position={null}
					scale={1}
					onDrag={(e, data) => changeValues(e, data)}
					bounds={{ right: 1300, left: 0 }}
				>
					<div
						className="handle"
						style={{
							paddingTop: '2px',
							backgroundColor: 'blueviolet',
							height: '10px',
							width: '10px',
						}}
					/>
				</Draggable>
			</div>
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
