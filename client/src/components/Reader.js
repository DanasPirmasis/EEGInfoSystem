import UpperToolbar from './UpperToolbar';
import Graphs from './Graphs';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Loader.css';

const edfdecoder = require('edfdecoder');

const Reader = (props) => {
	const [loadAnimation, setLoadAnimation] = useState(false);
	const [highlights, setHighlights] = useState([]);
	const params = useParams();

	useEffect(() => {
		if (props.edfFile.length === 0 && params.id) {
			(async function () {
				try {
					setLoadAnimation(true);
					let url = new URL('http://localhost:8000/api/v1/download');
					let reqParams = { id: params.id };
					url.search = new URLSearchParams(reqParams).toString();
					const res = await fetch(url);
					const arrayBuffer = await res.arrayBuffer();

					url = new URL('http://localhost:8000/api/v1/getHighlights');
					url.search = new URLSearchParams(reqParams).toString();
					const res2 = await fetch(url);
					const json = await res2.json();
					console.log(json);
					setHighlights(json.highlights);

					const decoder = new edfdecoder.EdfDecoder();
					decoder.setInput(arrayBuffer);
					decoder.decode();
					const output = decoder.getOutput();
					props.uploadHandler(output);

					setLoadAnimation(false);
				} catch (error) {
					setLoadAnimation(false);
					console.error(error);
					return;
				}
			})();
		}
	}, [props.edfFile, params.id]);

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
			{!loadAnimation && (
				<Graphs
					data={props.edfFile}
					edfRealFile={props.edfRealFile}
					duration={props.duration}
					amplitude={props.amplitude}
					signalButtonClicked={props.signalButtonClicked}
					signalButtonHandler={props.signalButtonHandler}
					brushSelected={props.brushSelected}
					brushHandler={props.brushHandler}
					saveState={props.saveState}
					saveStateHandler={props.saveHandler}
					userData={props.userData}
					highlights={props.highlights}
				/>
			)}
			{loadAnimation && <div className='loader' />}
		</div>
	);
};

export default Reader;
