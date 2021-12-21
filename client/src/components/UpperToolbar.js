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
} from '@mui/material';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

const UpperToolbar = (props) => {
	const [duration, setDuration] = useState(8);
	const [amplitude, setAmplitude] = useState(10);

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

	return (
		<Fade
			in={props.appear}
			timeout={1000}
			addEndListener={props.animationFinishedHandler}
		>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar sx={{ backgroundColor: '#121212' }}>
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							EEG WebReader
						</Typography>
						<div style={{ paddingRight: '1rem' }}>
							<FormControl
								variant="filled"
								size="small"
								sx={{
									width: '15rem',
									backgroundColor: 'white',
								}}
							>
								<InputLabel>Amplitude</InputLabel>
								<Select
									value={amplitude}
									label="Amplitude"
									onChange={changeAmplitude}
								>
									<MenuItem value={10}>10 uV</MenuItem>
								</Select>
							</FormControl>
						</div>
						<div style={{ paddingRight: '1rem' }}>
							<FormControl
								variant="filled"
								size="small"
								sx={{
									width: '15rem',
									backgroundColor: 'white',
								}}
							>
								<InputLabel>Duration</InputLabel>
								<Select
									value={duration}
									label="Duration"
									onChange={changeDuration}
								>
									<MenuItem value={4}>4 seconds</MenuItem>
									<MenuItem value={8}>8 seconds</MenuItem>
									<MenuItem value={32}>32 seconds</MenuItem>
									<MenuItem value={60}>60 seconds</MenuItem>
								</Select>
							</FormControl>
						</div>
						<Button
							variant="outlined"
							color="inherit"
							sx={{ marginRight: '1rem' }}
							onClick={signalChangeHandler}
						>
							Change Signals
						</Button>
						<Typography sx={{ marginRight: '1rem' }}>Guest User</Typography>
						<AccountCircleIcon
							sx={{ transform: 'scale(1.8)', marginRight: '1rem' }}
						></AccountCircleIcon>
						<Button
							variant="outlined"
							color="inherit"
							sx={{ marginLeft: '1rem' }}
						>
							Login
						</Button>
						<Button
							variant="outlined"
							color="inherit"
							sx={{ marginRight: '1rem', marginLeft: '1rem' }}
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
