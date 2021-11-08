import { useState } from 'react';
import UpperToolbar from './components/UpperToolbar';
import Login from './components/Login';
import Reader from './components/Reader';
import { Grid } from '@mui/material';
import DragAndDrop from './components/DragAndDrop';

const App = () => {
	const [nextScreen, setNextScreen] = useState(false);
	const [edfFile, setEdfFile] = useState([]);

	const fadeToNextScreen = () => {
		setNextScreen(true);
	};

	const uploadHandler = (file) => {
		setEdfFile(file);
		setNextScreen(true);
	};
	//TODO: Make it so that UpperToolbar and Reader components only mount after the others unmount
	return (
		<div>
			<Grid container direction="row">
				<Grid item sx={{ flexGrow: 1 }}>
					<DragAndDrop appear={!nextScreen} uploadHandler={uploadHandler} />
				</Grid>
				<Grid item>
					<Login
						appear={!nextScreen}
						loginSliderHandler={fadeToNextScreen}
					></Login>
				</Grid>
			</Grid>
			<UpperToolbar appear={nextScreen} />
			{nextScreen && <Reader data={edfFile} />}
		</div>
	);
};

export default App;
