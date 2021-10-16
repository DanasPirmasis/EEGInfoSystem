//import Channel from './components/Channel';
import Login from './components/Login';
import { useState } from 'react';
import UpperToolbar from './components/UpperToolbar';
import { Collapse } from '@mui/material';
const App = () => {
	const [loginSliderClicked, setloginSliderClicked] = useState(false);

	const loginSliderHandler = () => {
		setloginSliderClicked(true);
	};

	return (
		<div>
			<Collapse
				in={!loginSliderClicked}
				orientation='horizontal'
				timeout={2000}
			>
				<Login loginSliderHandler={loginSliderHandler} />
			</Collapse>
			{loginSliderClicked && <UpperToolbar />}
		</div>
	);
};

export default App;
