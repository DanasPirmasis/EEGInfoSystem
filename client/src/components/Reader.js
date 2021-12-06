import { Grid } from '@mui/material';
import LineChart from './LineChart';
import React, { useState } from 'react';
import MontageModal from './MontageModal';
import ZoomableLineChart from './ZoomableLineChart';

const Reader = (props) => {
	const [displayedSignals, setDisplayedSignals] = useState('');
	const [openModal, setOpenModal] = useState(true);

	const handleClose = () => setOpenModal(false);

	const dataHandler = (selectedData) => {
		console.log(selectedData);
		setDisplayedSignals(selectedData);
	};

	const testData = Array.from({ length: 3924 }, () =>
		Math.round(Math.random() * 100)
	);
	//console.log(props.data._header.signalInfo);
	//console.log(props.data._physicalSignals[0]);
	//let flatArray = props.data._physicalSignals[0].flat(Infinity);
	const arr = props.data._physicalSignals[0];
	console.log(props.data);
	//console.log(flat(arr));

	function flat(input) {
		let a = [];

		for (let i = 0; i < input.length; i++) {
			for (let j = 0; j < input[i].length; j++) {
				if (a.length < 1000) {
					a.push(input[i][j]);
				}
			}
		}
		return a;
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
					<ZoomableLineChart data={flat(arr)} />
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
