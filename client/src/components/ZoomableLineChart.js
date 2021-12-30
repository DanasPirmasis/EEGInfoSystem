import React, { useRef, useEffect, useState } from 'react';
import useResizeObserver from './useResizeObserver';
import {
	select,
	scaleLinear,
	line,
	axisBottom,
	axisLeft,
	zoom,
	brushX,
	selection,
} from 'd3';

import './Chart.css';

const ZoomableLineChart = (props) => {
	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	const [currentZoomState, setCurrentZoomState] = useState();
	const [selectedArea, setSelectedArea] = useState();

	useEffect(() => {
		console.log(props.data.length);
		const svg = select(svgRef.current);
		const svgContent = svg.select('.content');
		const { width, height } =
			dimensions || wrapperRef.current.getBoundingClientRect();

		const xScale = scaleLinear()
			.domain([0, props.data.length])
			.range([0, width]);

		const yScale = scaleLinear().domain(props.amplitude).range([height, 10]);

		if (currentZoomState) {
			const newYScale = currentZoomState.rescaleY(yScale);
			yScale.domain(newYScale.domain());
		}

		const lineGenerator = line()
			.x((d, index) => xScale(index))
			.y((d) => yScale(d));

		svgContent
			.selectAll('.myLine')
			.data([props.data])
			.join('path')
			.attr('class', 'myLine')
			.attr('stroke', '#7c56c2')
			.attr('stroke-width', 1, 5)
			.attr('fill', 'none')
			.attr('d', lineGenerator);

		let tickValues = [];

		for (let i = 0; i < props.data.length; i = i + props.hertzRate) {
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

		const zoomBehavior = zoom()
			.scaleExtent([0.1, 100])
			.translateExtent([
				[0, 0],
				[width, height],
			])
			.filter(!props.isBrushSelected)
			.on('zoom', (event) => {
				if (event.sourceEvent.type === 'dblclick') {
					const zoomState = event.transform;
					zoomState.k = 1;
					zoomState.x = 0;
					zoomState.y = 0;
					setCurrentZoomState(zoomState);
				} else {
					const zoomState = event.transform;
					setCurrentZoomState(zoomState);
				}
			});

		//This weird code is responsible for adding highlighted zones
		//It iterates through highlighted zones object and then creates a linear gradient.
		//This was done because I couldn't come up with a better way of having highlighted zones
		//If I were to do it again, I would probably try to find some d3.js methods for such functionality
		//Perhaps d3.js Drag could keep track of all of the zones
		//onClick would remove the zone
		//Coloring may be a problem
		if (props.highlights) {
			let backgroundSvg = document.getElementById(props.signalName);
			let backgroundStyleString = `linear-gradient(to right, #f7f7f7 0%, `;
			props.highlights.forEach((highlight) => {
				if (
					highlight.valueRange[1] > props.dataRange[0] &&
					highlight.valueRange[0] < props.dataRange[1] &&
					highlight.signalName === props.signalName
				) {
					let highlightWidth =
						highlight.valueRange[1] - highlight.valueRange[0];
					let highlightStart = highlight.valueRange[0] - props.dataRange[0];
					let highlightEnd = highlightStart + highlightWidth;
					if (highlightStart < 0) {
						highlightStart = 0;
					}
					let start = Math.round((highlightStart / props.data.length) * 100);
					let end = Math.round((highlightEnd / props.data.length) * 100);

					backgroundStyleString = backgroundStyleString.concat(
						`#f7f7f7 ${start}%, pink ${start}%,pink ${end}%, #f7f7f7 ${end}%, `
					);
				}
			});
			backgroundStyleString = backgroundStyleString.concat('#f7f7f7 100%)');
			backgroundSvg.style.background = backgroundStyleString;
		}

		const brush = brushX()
			.extent([
				[0, 0],
				[width, height],
			])
			.filter(props.isBrushSelected)
			.on('start brush', (event) => {
				if (event.selection) {
					const indexSelection = event.selection.map(xScale.invert);
					setSelectedArea(indexSelection);
				}
			})
			.on('end', (event) => {
				if (event.selection) {
					const indexSelection = event.selection.map(xScale.invert);
					setSelectedArea(indexSelection);
					indexSelection[0] = Math.round(indexSelection[0]);
					indexSelection[1] = Math.round(indexSelection[1]);

					props.newSelectedAreaHandler({
						signalName: props.signalName,
						valueRange: indexSelection,
					});
				}

				selection.call(brush.move, null);
			});

		svg.call(brush);
		svg.call(zoomBehavior);
	}, [
		currentZoomState,
		dimensions,
		props.data,
		props.dataRange,
		props.highlights,
		props.isBrushSelected,
		props.signalName,
		props.amplitude,
		selectedArea,
	]);

	return (
		<React.Fragment>
			<div ref={wrapperRef} className={'svgDiv'}>
				<svg
					className={'svg1'}
					id={props.signalName}
					style={{ height: 100 / props.numberOfSignals + 'vh' }}
					ref={svgRef}
				>
					<defs>
						<clipPath id={'chart1'}>
							<rect x='0' y='0' width='100%' height='100%' />
						</clipPath>
					</defs>
					<g className='content' clipPath={`url(#${'chart1'})`}></g>
					<g className='grid' />
					<g className='y-axis' />
				</svg>
			</div>
		</React.Fragment>
	);
};

export default ZoomableLineChart;
