import { useState } from 'react';
import UpperToolbar from './components/UpperToolbar';
import Login from './components/Login';
import Reader from './components/Reader';
import { Grid } from '@mui/material';
import DragAndDrop from './components/DragAndDrop';

const App = () => {
	const [loginSliderClicked, setLoginSliderClicked] = useState(false);
	const [animationFinished, setAnimationFinished] = useState(false);

	const loginSliderHandler = () => {
		setLoginSliderClicked(true);
	};

	const animationFinishedHandler = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setAnimationFinished(true);
	};

	return (
		<div>
			<UpperToolbar
				appear={loginSliderClicked}
				animationFinishedHandler={animationFinishedHandler}
			/>
			<Grid container direction="row">
				<Grid item xs={animationFinished ? 12 : 8}>
					{animationFinished && <Reader marginTop="65px" />}
					{!animationFinished && <DragAndDrop />}
				</Grid>
				{!animationFinished && (
					<Grid item xs={4}>
						<Login loginSliderHandler={loginSliderHandler} />
					</Grid>
				)}
			</Grid>
		</div>
	);
};

export default App;
