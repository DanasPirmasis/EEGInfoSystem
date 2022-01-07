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
	const confirmPasswordRef = useRef('');

	const [error, setError] = useState('');
	const [register, setRegister] = useState(false);

	const navigate = useNavigate();

	const loginHandler = async () => {
		try {
			let { data } = await axios.post('/api/auth/login', {
				email: emailRef.current.value,
				password: passwordRef.current.value,
			});

			localStorage.setItem('token', data.token);
			localStorage.setItem('email', emailRef.current.value);
			props.loginHandler(emailRef.current.value, data.fileIds);
			navigate('/Reader');
		} catch (error) {
			setError(error.response.data.error);
			setTimeout(() => {
				setError('');
			}, 5000);
		}
	};

	const registerHandler = async () => {
		if (passwordRef.current.value !== confirmPasswordRef.current.value) {
			setError('Passwords do not match');
			setTimeout(() => {
				setError('');
			}, 5000);
		} else {
			try {
				let { data } = await axios.post('/api/auth/register', {
					email: emailRef.current.value,
					password: passwordRef.current.value,
				});

				localStorage.setItem('token', data.token);
				localStorage.setItem('email', emailRef.current.value);
				props.loginHandler(emailRef.current.value, []);
				navigate('/Reader');
			} catch (error) {
				setError(error.response.data.error);
				setTimeout(() => {
					setError('');
				}, 5000);
			}
		}
	};

	const toRegister = () => {
		setRegister(true);
	};
	const toLogin = () => {
		setRegister(false);
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
				{register && (
					<TextField
						fullWidth
						label='Confirm password'
						type='password'
						variant='standard'
						margin='normal'
						inputRef={confirmPasswordRef}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<LockRounded />
								</InputAdornment>
							),
						}}
					/>
				)}
				{error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
				{!register && (
					<Button
						sx={{ marginTop: '20px' }}
						variant='contained'
						onClick={loginHandler}
					>
						Login
					</Button>
				)}
				{register && (
					<Button
						sx={{ marginTop: '20px' }}
						variant='contained'
						onClick={registerHandler}
					>
						Register
					</Button>
				)}

				{!register && (
					<Button
						onClick={toRegister}
						sx={{ marginTop: '20px', marginLeft: '20px' }}
					>
						Create new account
					</Button>
				)}
				{register && (
					<Button
						onClick={toLogin}
						sx={{ marginTop: '20px', marginLeft: '20px' }}
					>
						Already have an account?
					</Button>
				)}
			</Grid>
		</Grid>
	);
};

export default Login;
