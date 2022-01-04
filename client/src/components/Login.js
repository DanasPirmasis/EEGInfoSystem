import {
	Button,
	Grid,
	TextField,
	Typography,
	InputAdornment,
} from '@mui/material';
import { AccountCircle, LockRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';
import { useState } from 'react';

const Login = (props) => {
	const emailRef = useRef('');
	const passwordRef = useRef('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const loginHandler = async () => {
		try {
			let { data } = await axios.post('/api/auth/login', {
				email: emailRef.current.value,
				password: passwordRef.current.value,
			});

			localStorage.setItem('token', data.token);
			props.loginHandler(emailRef.current.value, data.fileIds);
			navigate('/Reader');
		} catch (error) {
			setError(error.response.data.error);
			setTimeout(() => {
				setError('');
			}, 5000);
		}
	};

	return (
		<Grid
			container
			display='flex'
			flexDirection='column'
			spacing={1}
			alignContent='center'
			justifyContent='center'
			width='35vw'
			minHeight='100vh'
			boxShadow='10px'
		>
			<Grid item xs={4} md={8}>
				<Typography variant='h4'>EEG WebReader</Typography>
			</Grid>
			<Grid item xs={4} md={8}>
				<TextField
					fullWidth
					label='Email'
					variant='standard'
					margin='normal'
					inputRef={emailRef}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<AccountCircle />
							</InputAdornment>
						),
					}}
				></TextField>
				<TextField
					fullWidth
					label='Password'
					type='password'
					variant='standard'
					margin='normal'
					inputRef={passwordRef}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<LockRounded />
							</InputAdornment>
						),
					}}
				></TextField>
				{error && <Typography sx={{ color: 'red' }}>{error}</Typography>}

				<Button
					sx={{ marginTop: '20px' }}
					variant='contained'
					onClick={loginHandler}
				>
					Login
				</Button>
				<Button sx={{ marginTop: '20px', marginLeft: '20px' }}>
					Create new account
				</Button>
			</Grid>
		</Grid>
	);
};

export default Login;
