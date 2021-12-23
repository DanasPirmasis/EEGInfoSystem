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
} from 'd3';

import './Chart.css';

const ZoomableLineChart = (props) => {
	const svgRef = useRef();
	const wrapperRef = useRef();
	const dimensions = useResizeObserver(wrapperRef);
	const [currentZoomState, setCurrentZoomState] = useState();
	const [isClicked, setIsClicked] = useState(true);
	const [highlightedZones, setHighlightedZones] = useState();
	const [selection, setSelection] = useState();

	const mouseDownHandler = (e) => {
		console.log(e);
		setIsClicked(true);
	};

	const moveHandler = (e) => {
		if (isClicked) console.log(e);
	};

	const mouseUpHandler = (e) => {
		console.log(e);
		setIsClicked(false);
	};

	const mouseClick = (e) => {
		console.log(e);
	};

	useEffect(() => {
		setHighlightedZones(props.highlights);
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
			.attr('stroke', '#7c56c2')
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

		//This weird code is responsible for adding highlighted zones
		//It iterates through highlighted zones object and then creates a linear gradient.
		if (highlightedZones) {
			let backgroundSvg = document.getElementById(props.signalName);
			let backgroundStyleString = `linear-gradient(to right, #f7f7f7 0%, `;
			highlightedZones.highlights.forEach((highlight) => {
				if (
					highlight.valueRange[1] > props.dataRange[0] &&
					highlight.valueRange[0] < props.dataRange[1] &&
					highlight.signalNumber === props.signalName
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
			.on('start brush end', (event) => {
				if (event.selection) {
					const indexSelection = event.selection.map(xScale.invert);
					setSelection(indexSelection);
				}
			});

		if (isClicked === true) {
			svg.call(brush);
		}
		//or i send position but the sent position is adjusted in the parent component for the current shown position
		//so if our selected zone is 1024-1152 and currently shown data is 768-1792
		//we will normalize those values to position data on the currently shown data
		//to do that we will count the distance from highlightStart to dataRangeStart: 1024 - 768 = 256
		//then we will count the width of the highliht: 1152 - 1024 = 128
		//then we will add that width to distance from dataRangeStart: 256 + 128 = 384
		//which means that we will highlight the interval of [256, 384]
		//another idea
		//instead of calculating the widthOfHighlight, we could calculate the distance to the end
		//which means we would deduct the dataRangeEnd from highlightEnd: 1792 - 1152 = 640
		//then to find the end of highlight we should deduct the distance from highlightStart: 640 - 256 = 384
		//console.log(xScale.invert(props.data[256]));
		//should get the index of this element as a state

		//svg zoom behavior mousedown should be disabled when selecting an eeg peak
		//if data range is within marked data then set style
		//svg.call(zoomBehavior).on('dblclick.zoom', null).on('mousedown.zoom', null);
		//console.log(props.signalName);
	}, [
		currentZoomState,
		dimensions,
		props.data,
		props.dataRange,
		props.highlights,
		selection,
	]);

	return (
		<React.Fragment>
			<div ref={wrapperRef} className={'svgDiv'}>
				<svg
					className={'svg1'}
					id={props.signalName}
					style={{ height: 100 / props.numberOfSignals + 'vh' }}
					ref={svgRef}
					// onMouseDown={mouseDownHandler}
					// onMouseUp={mouseUpHandler}
					// onMouseMove={moveHandler}
					// onClick={mouseClick}
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
