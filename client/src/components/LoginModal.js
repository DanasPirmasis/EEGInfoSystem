import {
	Modal,
	Box,
	Typography,
	Button,
	TextField,
	InputAdornment,
} from '@mui/material';

import axios from 'axios';
import { AccountCircle, LockRounded } from '@mui/icons-material';
import { useRef, useState } from 'react';

const LoginModal = (props) => {
	const emailRef = useRef('');
	const passwordRef = useRef('');
	const [error, setError] = useState('');

	const closeHandler = () => {
		props.loginModalHandler(false);
	};
	const userLoggedIn = async () => {
		try {
			let { data } = await axios.post('/api/auth/login', {
				email: emailRef.current.value,
				password: passwordRef.current.value,
			});

			localStorage.setItem('token', data.token);
			props.loginHandler(emailRef.current.value, data.fileIds);
			props.loginModalHandler(false);
		} catch (error) {
			setError(error.response.data.error);
			setTimeout(() => {
				setError('');
			}, 5000);
		}
	};

	return (
		<Modal
			open={props.open}
			onClose={closeHandler}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '35vw',
					height: '25vh',
					boxShadow: 12,
					bgcolor: 'background.paper',
				}}
			>
				<TextField
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
				/>
				<TextField
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
				/>
				{error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
				<Button
					sx={{ marginTop: '20px' }}
					variant='contained'
					onClick={userLoggedIn}
				>
					Login
				</Button>
			</Box>
		</Modal>
	);
};

export default LoginModal;
