import { Grid } from '@mui/material';
import LineChart from './LineChart';
import React, { useState } from 'react';
import MontageModal from './MontageModal';

const Reader = (props) => {
	const [displayedSignals, setDisplayedSignals] = useState('');
	const [openModal, setOpenModal] = useState(true);

	const handleClose = () => setOpenModal(false);

	const dataHandler = (selectedData) => {
		setDisplayedSignals(selectedData);
	};

	console.log(props.data._header.signalInfo);

	return (
		<React.Fragment>
			<Grid
				container
				spacing={1}
				alignItems="flex-start"
				justifyContent="flex-start"
				marginTop="64px"
			>
				<Grid item>Line Chart</Grid>
				<Grid item>
					<LineChart data={displayedSignals}></LineChart>
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
