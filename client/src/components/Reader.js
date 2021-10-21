import { Button, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import { useState } from 'react';

const Reader = () => {
	const [physicalSignal, setphysicalSignal] = useState('');

	const getGraphData = () => {
		Axios.get('http://localhost:5000/api/v1/')
			.then((response) => {
				//console.log(response.data);
				console.log(Object.values(response.data));
				console.log(Object.values(response.data).length);
				setphysicalSignal(Object.values(response.data));
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const a = Array.from(Array(768).keys());
	console.log(a);
	return (
		<Grid
			container
			spacing={1}
			alignItems="flex-start"
			justifyContent="flex-start"
		>
			<Grid item style={{ marginTop: '150px' }}>
				Line Chart
			</Grid>
			<Grid item>
				<Line
					data={{
						labels: a,
						datasets: [
							{
								label: 'Physical Signal 0 0',
								data: physicalSignal,
								pointStyle: 'line',
								borderColor: 'red',
							},
						],
					}}
					height={400}
					width={1200}
				></Line>
			</Grid>
			<Grid item>
				<Button onClick={getGraphData}>Get Data</Button>
			</Grid>
		</Grid>
	);
};

export default Reader;
