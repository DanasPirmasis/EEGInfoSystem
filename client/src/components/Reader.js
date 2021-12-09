import { Grid } from '@mui/material';
import React, { useState } from 'react';
import MontageModal from './MontageModal';
import ZoomableLineChart from './ZoomableLineChart';

const Reader = (props) => {
	const [selectedDataArray, setSelectedDataArray] = useState([]);
	const [openModal, setOpenModal] = useState(true);

	const handleClose = (selectedSignals) => {
		setOpenModal(false);
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

		for (let i = 0; i < signalNumberArray.length - 1; i = i + 2) {
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

	console.log(props.data);

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
					{selectedDataArray.map((signal) => (
						<ZoomableLineChart data={signal} />
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
