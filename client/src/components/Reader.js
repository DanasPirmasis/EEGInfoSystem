import { Grid } from '@mui/material';
import LineChart from './LineChart';
import React, { useState } from 'react';
import MontageModal from './MontageModal';
import ZoomableLineChart from './ZoomableLineChart';

const Reader = (props) => {
	const [displayedData, setDisplayedData] = useState([]);
	const [openModal, setOpenModal] = useState(true);

	const handleClose = (selectedSignals) => {
		let signalNumberArray = [];

		for (let i = 0; i < selectedSignals.length; i++) {
			let signal = selectedSignals[i].split(' - ');
			for (let j = 0; j < props.data._header.signalInfo.length; j++) {
				if (
					props.data._header.signalInfo[j].label === signal[0] ||
					props.data._header.signalInfo[j].label === signal[1]
				) {
					signalNumberArray.push(j);
				}
			}
		}
		for (let i = 0; i < signalNumberArray.length - 1; i++) {
			// setDisplayedData((displayedData) => [
			// 	...displayedData,
			// 	flattenAndSubtract(signalNumberArray[i], signalNumberArray[i + 1]),
			// ]);
			setDisplayedData(
				flattenAndSubtract(signalNumberArray[i], signalNumberArray[i + 1])
			);
		}

		//console.log(displayedData);
		setOpenModal(false);
	};

	const dataHandler = (selectedData) => {
		console.log(selectedData);
		setDisplayedData(selectedData);
	};

	// const testData = Array.from({ length: 3924 }, () =>
	// 	Math.round(Math.random() * 100)
	// );

	const arr = props.data._physicalSignals[0];
	console.log(props.data);
	//The idea is to have this function entered each time a match for signal name is found
	//This function will flatten the EDF (props.data) variable and then subtract values of the second signal, then update displayedData component with a new array of values
	//Hopefully this doesn't take up too much memory. React states reference instead of copy so should be fine
	function flattenAndSubtract(firstSignal, secondSignal) {
		let firstSignalData = props.data._physicalSignals[firstSignal];
		let secondSignalData = props.data._physicalSignals[secondSignal];
		let derivation = [];
		//first and second signal lengths should be the same
		for (let i = 0; i < firstSignalData.length; i++) {
			for (let j = 0; j < firstSignalData[i].length; j++) {
				if (derivation.length < 10000) {
					derivation.push(secondSignalData[i][j] - firstSignalData[i][j]);
				}
			}
		}
		//console.log(derivation);
		return derivation;
	}

	return (
		<React.Fragment>
			<Grid
				container
				spacing={1}
				alignItems="flex-start"
				justifyContent="flex-start"
				marginTop="64px"
			>
				<Grid item sx={{ flexGrow: 1 }}>
					{/* <LineChart data={displayedSignals}></LineChart> */}
					<ZoomableLineChart data={displayedData} />
				</Grid>
			</Grid>
			<MontageModal
				open={openModal}
				handleClose={handleClose}
				signals={props.data._header.signalInfo}
				chosenSignals={dataHandler}
			/>
		</React.Fragment>
	);
};

export default Reader;
