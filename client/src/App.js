import React, { useState, useEffect } from 'react';
import SettingsModal from './components/SettingsModal';
import LoginModal from './components/LoginModal';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Reader from './components/Reader';

const App = () => {
	const [nextScreen, setNextScreen] = useState(false);
	const [edfFile, setEdfFile] = useState([]);
	const [duration, setDuration] = useState(8);
	const [amplitude, setAmplitude] = useState(1000);
	const [signalButtonClicked, setSignalButtonClicked] = useState(true);
	const [brushSelected, setBrushSelected] = useState(false);
	const [saveSelected, setSaveSelected] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const [openLogin, setOpenLogin] = useState(false);
	const [userData, setUserData] = useState();
	const [userFiles, setUserFiles] = useState([]);

	const navigate = useNavigate();

	const loginHandler = () => {
		setSignalButtonClicked(false);
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

	const saveHandler = (saveState) => {
		setSaveSelected(saveState);
	};

	const settingsHandler = (settingsState) => {
		setOpenSettings(settingsState);
	};

	const loginModalHandler = (loginState) => {
		setOpenLogin(loginState);
	};

	useEffect(() => {
		if (localStorage.getItem('authToken')) {
			setSignalButtonClicked(false);
			navigate('/Reader');
		}
	}, [navigate]);

	return (
		<React.Fragment>
			<Routes>
				<Route
					path='/'
					element={
						<Home uploadHandler={uploadHandler} loginHandler={loginHandler} />
					}
				/>
				<Route
					path='/Reader'
					element={
						<Reader
							durationHandler={durationHandler}
							amplitudeHandler={amplitudeHandler}
							signalButtonHandler={signalButtonHandler}
							brushHandler={brushHandler}
							saveHandler={saveHandler}
							settingsHandler={settingsHandler}
							userData={userData}
							loginHandler={loginModalHandler}
							uploadHandler={uploadHandler}
							edfFile={edfFile}
							duration={duration}
							amplitude={amplitude}
							signalButtonClicked={signalButtonClicked}
							brushSelected={brushSelected}
							saveState={saveSelected}
						/>
					}
				/>
			</Routes>
			<SettingsModal
				open={openSettings}
				settingsHandler={settingsHandler}
				userData={userData}
				userFiles={userFiles}
			/>
			<LoginModal open={openLogin} loginHandler={loginHandler} />
		</React.Fragment>
	);
};

export default App;
