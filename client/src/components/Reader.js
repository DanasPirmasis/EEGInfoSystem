import { Grid, Slider } from '@mui/material';
import React, { useState, useEffect } from 'react';
import MontageModal from './MontageModal';
import ZoomableLineChart from './ZoomableLineChart';

const Reader = (props) => {
	const [selectedDataArray, setSelectedDataArray] = useState([]);
	const [shownDataInterval, setShownDataInterval] = useState(
		props.duration * 128
	);
	const [openModal, setOpenModal] = useState(true);
	const [tickPositions, setTickPositions] = useState([]);
	const [dimensions, setDimensions] = useState(0);
	const [amplitude, setAmplitude] = useState(props.amplitude);

	const handleClose = (selectedSignals) => {
		setSelectedDataArray([]);
		setOpenModal(false);
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
		setShownDataInterval(data);
	};

	const dimensionsOfChild = (dimensions) => {
		let a = document.querySelector('.grid').getElementsByClassName('tick');
		let pos = [];
		for (let i = 0; i < a.length; i++) {
			pos.push(a[i].getBoundingClientRect().x);
		}

		setTickPositions(pos);
		setDimensions(dimensions);
	};

	useEffect(() => {
		//setShownDataInterval((shownDataInterval) => shownDataInterval - props.duration * 128)
		console.log('useEffect');
		setOpenModal(true);
	}, [props.duration, props.signalButton]);

	return (
		<React.Fragment>
			<div>
				<Grid container marginTop="64px" justifyContent="center">
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
								size="medium"
								onChange={changeValues}
							/>
						)}
					</Grid>
					<Grid item md={12}>
						{selectedDataArray.map((signal) => (
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
							/>
						))}
					</Grid>
				</Grid>
				{selectedDataArray.length > 0 && (
					<div style={{ position: 'fixed', width: '100%', bottom: '5px' }}>
						<div
							style={{
								width: dimensions.width,
								height: '1px',
								backgroundColor: 'black',
								float: 'right',
							}}
						>
							{tickPositions.map((pos) => (
								<div
									style={{
										width: '1px',
										height: '10px',
										backgroundColor: 'black',
										position: 'fixed',
										bottom: '5px',
										left: pos + 'px',
									}}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			<MontageModal
				open={openModal}
				handleClose={handleClose}
				signals={props.data._header.signalInfo}
			/>
		</React.Fragment>
	);
};

export default Reader;
