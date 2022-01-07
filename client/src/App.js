import React, { useState } from 'react';
import SettingsModal from './components/SettingsModal';
import LoginModal from './components/LoginModal';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Reader from './components/Reader';

const App = () => {
	const [edfFile, setEdfFile] = useState([]);
	const [edfRealFile, setEdfRealFile] = useState([]);
	const [duration, setDuration] = useState(8);
	const [amplitude, setAmplitude] = useState(1000);
	const [signalButtonClicked, setSignalButtonClicked] = useState(true);
	const [brushSelected, setBrushSelected] = useState(false);
	const [saveSelected, setSaveSelected] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);
	const [openLogin, setOpenLogin] = useState(false);
	const [highlights, setHighlights] = useState([]);

	const loginHandler = (email, fileIds) => {
		setSignalButtonClicked(false);
	};

	const loginHandlerOutside = (email, fileIds) => {
		setEdfFile([]);
		setEdfRealFile([]);
		setBrushSelected(false);
		setHighlights([]);
		setSignalButtonClicked(false);
	};

	const uploadHandler = (file) => {
		setEdfFile(file);
	};

	const uploadHandlerWithFile = (file, realFile) => {
		setEdfFile(file);
		setEdfRealFile(realFile);
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

	const highlightHandler = (highlights) => {
		setHighlights(highlights);
	};

	return (
		<React.Fragment>
			<Routes>
				<Route
					path='/'
					element={
						<Home
							uploadHandler={uploadHandlerWithFile}
							loginHandler={loginHandlerOutside}
						/>
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
							loginHandler={loginModalHandler}
							uploadHandler={uploadHandlerWithFile}
							edfFile={edfFile}
							edfRealFile={edfRealFile}
							duration={duration}
							amplitude={amplitude}
							signalButtonClicked={signalButtonClicked}
							brushSelected={brushSelected}
							saveState={saveSelected}
							highlights={highlights}
						/>
					}
				/>
				<Route
					path='/Reader/:id'
					element={
						<Reader
							durationHandler={durationHandler}
							amplitudeHandler={amplitudeHandler}
							signalButtonHandler={signalButtonHandler}
							brushHandler={brushHandler}
							saveHandler={saveHandler}
							settingsHandler={settingsHandler}
							loginHandler={loginModalHandler}
							uploadHandler={uploadHandler}
							edfFile={edfFile}
							duration={duration}
							amplitude={amplitude}
							signalButtonClicked={signalButtonClicked}
							brushSelected={brushSelected}
							saveState={saveSelected}
							highlights={highlights}
						/>
					}
				/>
			</Routes>
			<SettingsModal
				open={openSettings}
				settingsHandler={settingsHandler}
				uploadHandler={uploadHandler}
				setHighlights={highlightHandler}
			/>
			<LoginModal
				open={openLogin}
				loginHandler={loginHandler}
				loginModalHandler={loginModalHandler}
			/>
		</React.Fragment>
	);
};

export default App;
