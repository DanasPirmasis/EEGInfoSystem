import {
	Modal,
	Box,
	Typography,
	Button,
	TextField,
	InputAdornment,
} from '@mui/material';

import { AccountCircle, LockRounded } from '@mui/icons-material';

const LoginModal = (props) => {
	const closeHandler = () => {
		props.loginHandler(false);
	};
	const userLoggedIn = () => {
		console.log('user logged in');
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
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<LockRounded />
							</InputAdornment>
						),
					}}
				/>
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
