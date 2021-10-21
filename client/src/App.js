import { useState } from 'react';
import UpperToolbar from './components/UpperToolbar';
import Login from './components/Login';
import Reader from './components/Reader';
import { Grid } from '@mui/material';

const App = () => {
	const [loginSliderClicked, setloginSliderClicked] = useState(false);

	const loginSliderHandler = () => {
		setloginSliderClicked(true);
	};

	return (
		<div>
			<Grid container direction="row">
				<Grid item xs={8}>
					<Reader />
				</Grid>
				<Grid item xs={4}>
					<Login loginSliderHandler={loginSliderHandler} />
				</Grid>
			</Grid>
			<UpperToolbar appear={loginSliderClicked} />
		</div>
	);
};

export default App;
