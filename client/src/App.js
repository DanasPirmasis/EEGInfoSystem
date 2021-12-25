import { useState } from 'react';
import UpperToolbar from './components/UpperToolbar';
import Login from './components/Login';
import Reader from './components/Reader';
import { Grid } from '@mui/material';
import DragAndDrop from './components/DragAndDrop';

const App = () => {
	const [nextScreen, setNextScreen] = useState(false);
	const [edfFile, setEdfFile] = useState([]);
	const [duration, setDuration] = useState(8);
	const [amplitude, setAmplitude] = useState(1000);
	const [signalButtonClicked, setSignalButtonClicked] = useState(true);
	const [brushSelected, setBrushSelected] = useState(false);

	const fadeToNextScreen = () => {
		setNextScreen(true);
	};

	const uploadHandler = (file) => {
		setEdfFile(file);
		setNextScreen(true);
	};

	const amplitudeHandler = (amplitude) => {
		setAmplitude(amplitude);
	};

	const durationHandler = (duration) => {
		setDuration(duration);
	};

	const signalButtonHandler = (buttonState) => {
		setSignalButtonClicked(buttonState);
	};

	const brushHandler = (brushState) => {
		console.log(brushState);
		setBrushSelected(brushState);
	};

	//Maybe I should move the modal to parent component
	return (
		<div>
			<Grid container direction='row'>
				<Grid item sx={{ flexGrow: 1 }}>
					<DragAndDrop
						appear={!nextScreen}
						uploadHandler={uploadHandler}
					/>
				</Grid>
				<Grid item>
					<Login
						appear={!nextScreen}
						loginSliderHandler={fadeToNextScreen}
					></Login>
				</Grid>
			</Grid>

			{nextScreen && (
				<div style={{ maxHeight: '80%%' }}>
					<UpperToolbar
						appear={nextScreen}
						durationHandler={durationHandler}
						amplitudeHandler={amplitudeHandler}
						signalButtonHandler={signalButtonHandler}
						brushHandler={brushHandler}
					/>
					<Reader
						data={edfFile}
						duration={duration}
						amplitude={amplitude}
						signalButtonClicked={signalButtonClicked}
						signalButtonHandler={signalButtonHandler}
						brushSelected={brushSelected}
						brushHandler={brushHandler}
					/>
				</div>
			)}
		</div>
	);
};

export default App;
