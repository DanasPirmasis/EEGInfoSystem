import { Grid, Slider } from '@mui/material';
import React, { useState } from 'react';
import MontageModal from './MontageModal';
import ZoomableLineChart from './ZoomableLineChart';

const Reader = (props) => {
	const [selectedDataArray, setSelectedDataArray] = useState([]);
	const [shownDataInterval, setShownDataInterval] = useState(1000);
	const [openModal, setOpenModal] = useState(true);

	const handleClose = (selectedSignals) => {
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
	//console.log(props.data);
	const changeValues = (e, data) => {
		setShownDataInterval(data);
	};

	return (
		<React.Fragment>
			<Grid container marginTop="64px" justifyContent="center">
				<Grid item md={10}>
					<Slider
						value={shownDataInterval}
						step={100}
						min={1000}
						max={selectedDataArray[0] ? selectedDataArray[0].length : 1000}
						size="medium"
						onChange={changeValues}
					/>
				</Grid>
				<Grid item md={12}>
					{selectedDataArray.map((signal) => (
						<ZoomableLineChart
							data={signal.slice(shownDataInterval - 1000, shownDataInterval)}
							dataRange={[shownDataInterval - 1000, shownDataInterval]}
						/>
					))}
				</Grid>
			</Grid>
			<MontageModal
				open={openModal}
				handleClose={handleClose}
				signals={props.data._header.signalInfo}
			/>
		</React.Fragment>
	);
};

export default Reader;
