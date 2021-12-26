import { Grid, Slider } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MontageModal from './MontageModal';
import SaveModal from './SaveModal';
import TimeBar from './TimeBar';
import ZoomableLineChart from './ZoomableLineChart';

const Reader = (props) => {
	const [selectedDataArray, setSelectedDataArray] = useState([]);
	const [shownDataInterval, setShownDataInterval] = useState(
		props.duration * 128
	);
	const [time, setTime] = useState([]);
	const [openModal, setOpenModal] = useState(props.signalButtonClicked);
	const [openSaveModal, setOpenSaveModal] = useState(props.saveState);
	const [tickPositions, setTickPositions] = useState([]);
	const [dimensions, setDimensions] = useState(0);
	const [amplitude, setAmplitude] = useState(props.amplitude);
	const [duration, setDuration] = useState(props.duration);
	const [shownSignals, setShownSignals] = useState([]);
	const [isBrushSelected, setIsBrushSelected] = useState(false);
	const [highlightedZones, setHighlightedZones] = useState([
		{
			signalName: 'F-RF - H-RF',
			valueRange: [256, 512],
			comment: 'Beans',
		},
		{
			signalName: 'H-RF - A1-RF',
			valueRange: [718, 800],
			comment: 'Pancakes',
		},
	]);
	const [newHighlights, setNewHighlights] = useState([]);

	const handleClose = (selectedSignals) => {
		setSelectedDataArray([]);
		setOpenModal(false);
		setShownSignals(selectedSignals);
		props.signalButtonHandler(false);
		let signalNumberArray = [];
		for (let i = 0; i < selectedSignals.length; i++) {
			let signal = selectedSignals[i].split(' - ');
			for (let j = 0; j < props.data._header.signalInfo.length; j++) {
				let headerSignalLabels =
					props.data._header.signalInfo[j].label.toLowerCase();
				if (
					headerSignalLabels === signal[0].toLowerCase() ||
					headerSignalLabels === signal[1].toLowerCase()
				) {
					signalNumberArray.push(j);
				}
			}
		}

		for (let i = 0; i < signalNumberArray.length; i = i + 2) {
			let firstSignal = signalNumberArray[i];
			let secondSignal = signalNumberArray[i + 1];

			let flatDerivedArray = flattenAndSubtract(firstSignal, secondSignal);
			setSelectedDataArray((selectedDataArray) => [
				...selectedDataArray,
				flatDerivedArray,
			]);
		}
	};

	const flattenAndSubtract = (firstSignal, secondSignal) => {
		let firstSignalData = props.data._physicalSignals[firstSignal];
		let secondSignalData = props.data._physicalSignals[secondSignal];
		let derivation = [];

		if (props.data) {
			for (let i = 0; i < firstSignalData.length; i++) {
				for (let j = 0; j < firstSignalData[i].length; j++) {
					derivation.push(secondSignalData[i][j] - firstSignalData[i][j]);
				}
			}
		}

		return derivation;
	};

	const changeValues = (e, data) => {
		let currentIntervalTime = data / 128;
		setShownDataInterval(data);

		let dateChanger = new Date(props.data._header.recordingDate);

		if (dateChanger < 0) {
			dateChanger.setFullYear(1970);
		}
		dateChanger.setSeconds(dateChanger.getSeconds() + currentIntervalTime);

		let dateStringArray = [];
		for (let i = 0; i < duration; i++) {
			dateChanger.setSeconds(dateChanger.getSeconds() - 1);
			dateStringArray.push(
				dateChanger.getHours() +
					':' +
					dateChanger.getMinutes() +
					':' +
					dateChanger.getSeconds()
			);
		}
		setTime(dateStringArray.reverse());
	};

	const dimensionsOfChild = (dimensions) => {
		let a = document.querySelector('.grid').getElementsByClassName('tick');
		let pos = [];
		for (let i = 0; i < a.length; i++) {
			pos.push(a[i].getBoundingClientRect().x);
		}
		console.log(pos);
		setTickPositions(pos);
		setDimensions(dimensions);
	};

	const newSelectedAreaHandler = (newHighlight) => {
		console.log(newHighlight);
		setNewHighlights((newHighlights) => [...newHighlights, newHighlight]);
	};

	const handleNewHighlightSave = (addedHighlights) => {
		console.log(addedHighlights);
		addedHighlights.forEach((highlight) => {
			let tempHighlightArray = newHighlights;
			tempHighlightArray = tempHighlightArray.filter((val) => {
				return val.valueRange !== highlight.valueRange;
			});
			setNewHighlights(tempHighlightArray);
		});
		let tempZones = highlightedZones;
		addedHighlights.forEach((newAddition) => {
			tempZones.push(newAddition);
		});

		setHighlightedZones(tempZones);
	};

	const handleSaveModalClose = () => {
		setOpenSaveModal(false);
		props.saveStateHandler(false);
	};

	const removeNewHighlight = (highlight) => {
		let tempHighlightArray = newHighlights;
		tempHighlightArray = tempHighlightArray.filter((val) => {
			return val.valueRange !== highlight.valueRange;
		});
		setNewHighlights(tempHighlightArray);
	};

	useEffect(() => {
		setShownDataInterval(props.duration * 128);
		setDuration(props.duration);
		setAmplitude(props.amplitude);
		setOpenModal(props.signalButtonClicked);
		setIsBrushSelected(props.brushSelected);
		setOpenSaveModal(props.saveState);
		console.log('a');
		let childSvg = document.querySelector('.svg1');

		if (childSvg !== null) {
			setDimensions(childSvg.getBoundingClientRect().width);
			setTimeout(() => {
				let childSvgTicks = document
					.querySelector('.grid')
					.getElementsByClassName('tick');

				let pos = [];
				for (let i = 0; i < childSvgTicks.length; i++) {
					pos.push(childSvgTicks[i].getBoundingClientRect().x);
				}

				setTickPositions(pos);
			}, 25);
		}
	}, [
		props.signalButtonClicked,
		props.amplitude,
		props.duration,
		props.brushSelected,
		props.saveState,
	]);

	return (
		<React.Fragment>
			<div>
				<Grid container justifyContent='center'>
					<Grid item md={10}>
						{selectedDataArray.length > 0 && (
							<Slider
								value={shownDataInterval}
								step={128}
								min={props.duration * 128}
								max={
									selectedDataArray[0]
										? selectedDataArray[0].length
										: props.duration * 128
								}
								size='medium'
								onChange={changeValues}
							/>
						)}
					</Grid>
					<Grid item md={12}>
						{selectedDataArray.map((signal, index) => (
							<ZoomableLineChart
								data={signal.slice(
									shownDataInterval - props.duration * 128,
									shownDataInterval
								)}
								dataRange={[
									shownDataInterval - props.duration * 128,
									shownDataInterval,
								]}
								dimensionCallback={dimensionsOfChild}
								numberOfSignals={selectedDataArray.length}
								signalName={shownSignals[index]}
								highlights={highlightedZones}
								isBrushSelected={isBrushSelected}
								amplitude={[-amplitude, amplitude]}
								newSelectedAreaHandler={newSelectedAreaHandler}
								key={shownSignals[index]}
							/>
						))}
					</Grid>
				</Grid>
				{selectedDataArray.length > 0 && (
					<div
						style={{
							position: 'fixed',
							width: '100%',
							bottom: '15px',
						}}
					>
						<div
							style={{
								width: dimensions,
								height: '1px',
								backgroundColor: '#f7f7f700',
								float: 'right',
							}}
						>
							<TimeBar pos={tickPositions} val={time} />
						</div>
					</div>
				)}
			</div>

			<MontageModal
				open={openModal}
				handleClose={handleClose}
				signals={props.data._header.signalInfo}
			/>
			<SaveModal
				open={openSaveModal}
				handleClose={handleSaveModalClose}
				saveHandler={handleNewHighlightSave}
				newHighlights={newHighlights}
				removeNewHighlight={removeNewHighlight}
			/>
		</React.Fragment>
	);
};

export default Reader;
