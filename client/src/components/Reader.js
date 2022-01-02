import UpperToolbar from './UpperToolbar';
import Graphs from './Graphs';

const Reader = (props) => {
	return (
		<div>
			<UpperToolbar
				durationHandler={props.durationHandler}
				amplitudeHandler={props.amplitudeHandler}
				signalButtonHandler={props.signalButtonHandler}
				brushHandler={props.brushHandler}
				saveHandler={props.saveHandler}
				settingsHandler={props.settingsHandler}
				userData={props.userData}
				loginHandler={props.loginHandler}
				uploadHandler={props.uploadHandler}
			/>
			<Graphs
				data={props.edfFile}
				duration={props.duration}
				amplitude={props.amplitude}
				signalButtonClicked={props.signalButtonClicked}
				signalButtonHandler={props.signalButtonHandler}
				brushSelected={props.brushSelected}
				brushHandler={props.brushHandler}
				saveState={props.saveState}
				saveStateHandler={props.saveHandler}
			/>
		</div>
	);
};

export default Reader;
