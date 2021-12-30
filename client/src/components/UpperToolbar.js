import {
	AppBar,
	Button,
	Fade,
	Toolbar,
	Typography,
	InputLabel,
	Select,
	FormControl,
	MenuItem,
	IconButton,
} from '@mui/material';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BrushIcon from '@mui/icons-material/Brush';
import { useState } from 'react';

const edfdecoder = require('edfdecoder');

const UpperToolbar = (props) => {
	const [duration, setDuration] = useState(8);
	const [amplitude, setAmplitude] = useState(1000);
	const [brushColor, setBrushColor] = useState('#FFFFFF');

	const changeDuration = (e) => {
		setDuration(e.target.value);
		props.durationHandler(e.target.value);
	};

	const changeAmplitude = (e) => {
		setAmplitude(e.target.value);
		props.amplitudeHandler(e.target.value);
	};

	const signalChangeHandler = () => {
		props.signalButtonHandler(true);
	};

	const fileChangeHandler = (e) => {
		//console.log(e.target.files[0]);
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onabort = () => console.log('file reading was aborted');
		reader.onerror = () => console.log('file reading has failed');
		reader.onload = () => {
			const binaryStr = reader.result;
			const outputFile = decodeEdfFile(binaryStr);
			props.uploadHandler(outputFile);
		};
		reader.readAsArrayBuffer(file);
		//console.log(outputFile);
	};

	const decodeEdfFile = (file) => {
		try {
			const decoder = new edfdecoder.EdfDecoder();
			decoder.setInput(file);
			decoder.decode();
			const output = decoder.getOutput();
			console.log(output);
			return output;
		} catch (error) {
			console.log(error);
		}
	};

	const brushHandler = () => {
		props.brushHandler(brushColor === '#FFFFFF' ? true : false);
		setBrushColor((brushColor) =>
			brushColor === '#FFFFFF' ? '#585CD2' : '#FFFFFF'
		);
	};

	const saveHandler = () => {
		props.saveHandler(true);
	};

	const openSettings = () => {
		props.settingsHandler(true);
	};

	const loginHandler = () => {
		props.loginHandler(true);
	};

	return (
		<Fade
			in={props.appear}
			timeout={1000}
			addEndListener={props.animationFinishedHandler}
		>
			<AppBar sx={{ backgroundColor: '#121212', position: 'sticky' }}>
				<Toolbar>
					<Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
						<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
							EEG WebReader
						</Typography>
						<Button
							size='small'
							variant='outlined'
							color='inherit'
							sx={{ marginRight: '1rem' }}
							onClick={saveHandler}
						>
							Save highlight
						</Button>
						<IconButton onClick={brushHandler}>
							<BrushIcon
								sx={{ color: brushColor }}
								fontSize='large'
							></BrushIcon>
						</IconButton>

						<FormControl
							variant='filled'
							size='small'
							sx={{
								marginRight: '1rem',
								backgroundColor: 'white',
							}}
						>
							<InputLabel>Amplitude</InputLabel>
							<Select
								value={amplitude}
								label='Amplitude'
								onChange={changeAmplitude}
							>
								<MenuItem value={250}>250 uV</MenuItem>
								<MenuItem value={500}>500 uV</MenuItem>
								<MenuItem value={1000}>1000 uV</MenuItem>
								<MenuItem value={2500}>2500 uV</MenuItem>
								<MenuItem value={5000}>5000 uV</MenuItem>
								<MenuItem value={10000}>10000 uV</MenuItem>
							</Select>
						</FormControl>
						<FormControl
							variant='filled'
							size='small'
							sx={{
								marginRight: '1rem',
								backgroundColor: 'white',
							}}
						>
							<InputLabel>Duration</InputLabel>
							<Select
								value={duration}
								label='Duration'
								onChange={changeDuration}
							>
								<MenuItem value={4}>4 seconds</MenuItem>
								<MenuItem value={8}>8 seconds</MenuItem>
								<MenuItem value={32}>32 seconds</MenuItem>
								<MenuItem value={60}>60 seconds</MenuItem>
							</Select>
						</FormControl>

						<input
							accept='.edf'
							style={{ display: 'none' }}
							id='raised-button-file'
							type='file'
							onInput={fileChangeHandler}
						/>
						<label style={{ marginRight: '1rem' }} htmlFor='raised-button-file'>
							<Button
								size='small'
								color='inherit'
								variant='outlined'
								component='span'
							>
								Change file
							</Button>
						</label>
						<Button
							size='small'
							variant='outlined'
							color='inherit'
							sx={{ marginRight: '1rem' }}
							onClick={signalChangeHandler}
						>
							Change Signals
						</Button>

						<Button
							size='small'
							variant='outlined'
							color='inherit'
							sx={{ marginRight: '1rem' }}
						>
							Help
						</Button>
						{!props.userData && (
							<Button
								size='small'
								variant='outlined'
								color='inherit'
								sx={{ marginRight: '1rem' }}
								onClick={loginHandler}
							>
								Login
							</Button>
						)}
						{props.userData && (
							<IconButton onClick={openSettings}>
								<AccountCircleIcon
									sx={{
										transform: 'scale(1.8)',
										marginRight: '0.5rem',
										color: '#FFFFFF',
									}}
								></AccountCircleIcon>
							</IconButton>
						)}
					</Box>
				</Toolbar>
			</AppBar>
		</Fade>
	);
};

export default UpperToolbar;
