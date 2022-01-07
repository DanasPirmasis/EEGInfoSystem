import { Grid, Slider } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import MontageModal from './MontageModal';
import SaveModal from './SaveModal';
import TimeBar from './TimeBar';
import ZoomableLineChart from './ZoomableLineChart';
import { useNavigate, useParams } from 'react-router-dom';

const Reader = (props) => {
	const [selectedDataArray, setSelectedDataArray] = useState([]);
	const [shownDataInterval, setShownDataInterval] = useState(0);
	const [time, setTime] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openSaveModal, setOpenSaveModal] = useState(false);
	const [tickPositions, setTickPositions] = useState([]);
	const [dimensions, setDimensions] = useState(0);
	const [amplitude, setAmplitude] = useState(props.amplitude);
	const [duration, setDuration] = useState(props.duration);
	const [shownSignals, setShownSignals] = useState([]);
	const [isBrushSelected, setIsBrushSelected] = useState(false);
	const [highlightedZones, setHighlightedZones] = useState([]);
	const [newHighlights, setNewHighlights] = useState([]);
	const [file, setFile] = useState(props.data);

	const params = useParams();
	const navigate = useNavigate();

	const handleClose = (selectedSignals) => {
		setSelectedDataArray([]);
		setOpenModal(false);
		setShownSignals(selectedSignals);
		console.log(selectedSignals);
		props.signalButtonHandler(false);

		let signalNumberArray = [];
		for (let i = 0; i < selectedSignals.length; i++) {
			let signal = selectedSignals[i].split(' - ');
			if (signal.length === 1) {
				signal = selectedSignals[i].split(' + ');
				signalNumberArray.push('+');
			} else {
				signalNumberArray.push('-');
			}
			for (let j = 0; j < file._header.signalInfo.length; j++) {
				let headerSignalLabels = file._header.signalInfo[j].label.toLowerCase();
				if (headerSignalLabels === signal[0].toLowerCase()) {
					signalNumberArray.push(j);
				}
			}
			for (let j = 0; j < file._header.signalInfo.length; j++) {
				let headerSignalLabels = file._header.signalInfo[j].label.toLowerCase();
				if (headerSignalLabels === signal[1].toLowerCase()) {
					signalNumberArray.push(j);
				}
			}
		}

		for (let i = 0; i < signalNumberArray.length; i = i + 3) {
			let operationType = signalNumberArray[i];
			let firstSignal = signalNumberArray[i + 1];
			let secondSignal = signalNumberArray[i + 2];

			let flatDerivedArray = flattenAndSubtract(
				operationType,
				firstSignal,
				secondSignal
			);
			setSelectedDataArray((selectedDataArray) => [
				...selectedDataArray,
				flatDerivedArray,
			]);
		}
	};

	const flattenAndSubtract = (operationType, firstSignal, secondSignal) => {
		let firstSignalData = file._physicalSignals[firstSignal];
		let secondSignalData = file._physicalSignals[secondSignal];

		let derivation = [];

		if (firstSignal === secondSignal) {
			for (let i = 0; i < firstSignalData.length; i++) {
				for (let j = 0; j < firstSignalData[i].length; j++) {
					derivation.push(firstSignalData[i][j]);
				}
			}
			return derivation;
		}

		if (operationType === '+') {
			for (let i = 0; i < firstSignalData.length; i++) {
				for (let j = 0; j < firstSignalData[i].length; j++) {
					derivation.push(secondSignalData[i][j] + firstSignalData[i][j]);
				}
			}
		} else {
			for (let i = 0; i < firstSignalData.length; i++) {
				for (let j = 0; j < firstSignalData[i].length; j++) {
					derivation.push(secondSignalData[i][j] - firstSignalData[i][j]);
				}
			}
		}

		return derivation;
	};

	const changeValues = (e, data) => {
		let currentIntervalTime =
			data /
			(file._header.signalInfo[0].nbOfSamples /
				file._header.durationDataRecordsSec);
		setShownDataInterval(data);

		let dateChanger = new Date(file._header.recordingDate);

		if (dateChanger < 0) {
			dateChanger.setFullYear(1970);
		}
		dateChanger.setSeconds(dateChanger.getSeconds() + currentIntervalTime);

		let dateStringArray = [];
		for (let i = 0; i < duration; i++) {
			dateChanger.setSeconds(dateChanger.getSeconds() - 1);
			dateStringArray.push(
				dateChanger.getHours() +
					':' +
					dateChanger.getMinutes() +
					':' +
					dateChanger.getSeconds()
			);
		}
		setTime(dateStringArray.reverse());
	};

	const dimensionsOfChild = (dimensions) => {
		let a = document.querySelector('.grid').getElementsByClassName('tick');
		let pos = [];
		for (let i = 0; i < a.length; i++) {
			pos.push(a[i].getBoundingClientRect().x);
		}

		setTickPositions(pos);
		setDimensions(dimensions);
	};

	const newSelectedAreaHandler = (newHighlight) => {
		setNewHighlights((newHighlights) => [...newHighlights, newHighlight]);
	};

	const handleNewHighlightSave = async (addedHighlights) => {
		addedHighlights.forEach((highlight) => {
			let tempHighlightArray = newHighlights;
			tempHighlightArray = tempHighlightArray.filter((val) => {
				return val.valueRange !== highlight.valueRange;
			});
			setNewHighlights(tempHighlightArray);
		});
		let tempZones = highlightedZones;
		addedHighlights.forEach((newAddition) => {
			tempZones.push(newAddition);
		});

		setHighlightedZones(tempZones);

		let email = props.userData;
		let fileId = params.id;

		if (!fileId && email) {
			try {
				const formData = new FormData();
				formData.append('file', props.edfRealFile);
				formData.append('email', email);

				const fileUploadReq = await fetch(
					'http://localhost:8000/api/v1/upload',
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
						body: formData,
					}
				);
				const fileUploadRes = await fileUploadReq.json();

				await fetch('http://localhost:8000/api/v1/uploadHighlights', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify({
						highlights: tempZones,
						fileId: fileUploadRes.id,
						email: email,
					}),
				});

				if (fileUploadRes.id !== undefined)
					navigate(`/Reader/${fileUploadRes.id}`);
			} catch (error) {
				console.log(error);
			}
		} else if (fileId && email) {
			try {
				await fetch('http://localhost:8000/api/v1/uploadHighlights', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify({
						highlights: tempZones,
						fileId: fileId,
						email: email,
					}),
				});
			} catch (error) {
				console.error(error.response.data.error);
			}
		}
	};

	const handleSaveModalClose = () => {
		setOpenSaveModal(false);
		props.saveStateHandler(false);
	};

	const removeNewHighlight = (highlight) => {
		let tempHighlightArray = newHighlights;
		tempHighlightArray = tempHighlightArray.filter((val) => {
			return val.valueRange !== highlight.valueRange;
		});
		setNewHighlights(tempHighlightArray);
	};

	useEffect(() => {
		setDuration(props.duration);
		setAmplitude(props.amplitude);
		setOpenModal(props.signalButtonClicked);
		setIsBrushSelected(props.brushSelected);
		setOpenSaveModal(props.saveState);

		if (props.highlights.length > 0) setHighlightedZones(props.highlights);

		let childSvg = document.querySelector('.svg1');

		if (childSvg !== null) {
			setDimensions(childSvg.getBoundingClientRect().width);
			setTimeout(() => {
				let childSvgTicks = childSvg
					.querySelector('.grid')
					.getElementsByClassName('tick');

				let pos = [];
				for (let i = 0; i < childSvgTicks.length; i++) {
					pos.push(childSvgTicks[i].getBoundingClientRect().x);
				}

				setTickPositions(pos);
			});
		}
	}, [
		props.signalButtonClicked,
		props.amplitude,
		props.duration,
		props.brushSelected,
		props.saveState,
		props.highlights,
	]);

	useMemo(() => {
		setOpenModal(true);
		setSelectedDataArray([]);
		setFile(props.data);
		if (props.data !== undefined && props.data.length > 0) {
			setShownDataInterval(
				props.duration *
					(props.data._header.signalInfo[0].nbOfSamples /
						props.data._header.durationDataRecordsSec)
			);
		}
	}, [props.data]);

	return (
		<React.Fragment>
			<div>
				<Grid container justifyContent='center'>
					<Grid item md={10}>
						{selectedDataArray.length > 0 && (
							<Slider
								value={shownDataInterval}
								step={
									file._header.signalInfo[0].nbOfSamples /
									file._header.durationDataRecordsSec
								}
								min={
									props.duration *
									(file._header.signalInfo[0].nbOfSamples /
										file._header.durationDataRecordsSec)
								}
								max={
									selectedDataArray[0]
										? selectedDataArray[0].length
										: props.duration *
										  (file._header.signalInfo[0].nbOfSamples /
												file._header.durationDataRecordsSec)
								}
								size='medium'
								onChange={changeValues}
							/>
						)}
					</Grid>
					<Grid item md={12}>
						{selectedDataArray.map((signal, index) => (
							<ZoomableLineChart
								data={signal.slice(
									shownDataInterval -
										props.duration *
											(file._header.signalInfo[0].nbOfSamples /
												file._header.durationDataRecordsSec),
									shownDataInterval
								)}
								dataRange={[
									shownDataInterval -
										props.duration *
											(file._header.signalInfo[0].nbOfSamples /
												file._header.durationDataRecordsSec),
									shownDataInterval,
								]}
								hertzRate={
									file._header.signalInfo[0].nbOfSamples /
									file._header.durationDataRecordsSec
								}
								dimensionCallback={dimensionsOfChild}
								numberOfSignals={selectedDataArray.length}
								signalName={shownSignals[index]}
								highlights={highlightedZones}
								isBrushSelected={isBrushSelected}
								amplitude={[-amplitude, amplitude]}
								newSelectedAreaHandler={newSelectedAreaHandler}
								key={shownSignals[index]}
							/>
						))}
					</Grid>
				</Grid>
				{selectedDataArray.length > 0 && (
					<div
						style={{
							position: 'fixed',
							width: '100%',
							bottom: '15px',
						}}
					>
						<div
							style={{
								width: dimensions,
								height: '1px',
								backgroundColor: '#f7f7f700',
								float: 'right',
							}}
						>
							<TimeBar pos={tickPositions} val={time} />
						</div>
					</div>
				)}
			</div>

			<MontageModal open={openModal} handleClose={handleClose} signals={file} />
			<SaveModal
				open={openSaveModal}
				handleClose={handleSaveModalClose}
				saveHandler={handleNewHighlightSave}
				newHighlights={newHighlights}
				removeNewHighlight={removeNewHighlight}
			/>
		</React.Fragment>
	);
};

export default Reader;
