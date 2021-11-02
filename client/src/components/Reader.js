import { Button, Grid } from '@mui/material';
import LineChart from './LineChart';
import Axios from 'axios';
import { useState } from 'react';

const Reader = () => {
	const [physicalSignal, setphysicalSignal] = useState('');

	const getGraphData = () => {
		Axios.get('http://localhost:5000/api/v1/')
			.then((response) => {
				setphysicalSignal(Object.values(response.data));
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const a = Array.from(Array(physicalSignal.length).keys());

	const getTestData = () => {
		const start = new Date();
		Axios.get('http://localhost:5000/api/v1/physicalSignals')
			.then((response) => {
				console.log(response);
				const timeTaken = new Date() - start;
				console.log(timeTaken);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Grid
			container
			spacing={1}
			alignItems="flex-start"
			justifyContent="flex-start"
		>
			<Grid item>Line Chart</Grid>
			<Grid item>
				<LineChart data={physicalSignal} labels={a}></LineChart>
			</Grid>
			<Grid item>
				<Button onClick={getGraphData}>Get Data</Button>
			</Grid>
			<Grid item>
				<Button onClick={getTestData}>Get Test Data</Button>
			</Grid>
		</Grid>
	);
};

export default Reader;
