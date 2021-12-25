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

	const brushHandler = (e) => {
		props.brushHandler(brushColor === '#FFFFFF' ? true : false);
		setBrushColor((brushColor) =>
			brushColor === '#FFFFFF' ? '#585CD2' : '#FFFFFF'
		);
	};

	return (
		<Fade
			in={props.appear}
			timeout={1000}
			addEndListener={props.animationFinishedHandler}
		>
			{/* sx={{ backgroundColor: '#121212' }} */}
			<Box sx={{ flexGrow: 1 }}>
				<AppBar sx={{ backgroundColor: '#121212', position: 'sticky' }}>
					<Toolbar>
						<Typography
							variant='h6'
							component='div'
							sx={{ flexGrow: 1 }}
						>
							EEG WebReader
						</Typography>
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
						<Box
							style={{
								marginLeft: '1rem',
								marginRight: '1rem',
							}}
						>
							<FormControl
								variant='filled'
								size='small'
								sx={{
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
						</Box>
						<Button
							variant='outlined'
							color='inherit'
							sx={{ marginRight: '1rem' }}
							onClick={signalChangeHandler}
						>
							Change Signals
						</Button>
						<Typography sx={{ marginRight: '0.5rem' }}>
							Guest User
						</Typography>
						<AccountCircleIcon
							sx={{
								transform: 'scale(1.8)',
								marginRight: '0.5rem',
							}}
						></AccountCircleIcon>
						<Button
							variant='outlined'
							color='inherit'
							sx={{ marginLeft: '0.5rem' }}
						>
							Login
						</Button>
						<Button
							variant='outlined'
							color='inherit'
							sx={{ marginLeft: '1rem' }}
						>
							Help
						</Button>
					</Toolbar>
				</AppBar>
			</Box>
		</Fade>
	);
};

export default UpperToolbar;
