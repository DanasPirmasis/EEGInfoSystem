import {
	Button,
	Collapse,
	Grid,
	TextField,
	Typography,
	InputAdornment,
} from '@mui/material';
import { AccountCircle, LockRounded } from '@mui/icons-material';
import { useState } from 'react';

const Login = (props) => {
	const [loginSliderClicked, setloginSliderClicked] = useState(false);

	const loginSliderHandler = () => {
		setloginSliderClicked(true);
		props.loginSliderHandler();
	};

	return (
		<Collapse
			sx={{ float: 'right' }}
			in={!loginSliderClicked}
			orientation="horizontal"
			timeout={700}
		>
			<Grid
				container
				display="flex"
				flexDirection="column"
				spacing={4}
				alignContent="center"
				justifyContent="center"
				width="40vw"
				minHeight="100vh"
				boxShadow="10px"
			>
				<Grid item xs={8}>
					<Typography variant="h4">EEG WebReader</Typography>
				</Grid>
				<Grid item xs={8}>
					<TextField
						fullWidth
						label="Email"
						variant="standard"
						margin="normal"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircle />
								</InputAdornment>
							),
						}}
					></TextField>
					<TextField
						fullWidth
						label="Password"
						type="password"
						variant="standard"
						margin="normal"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LockRounded />
								</InputAdornment>
							),
						}}
					></TextField>

					<Button variant="contained" onClick={loginSliderHandler}>
						Login
					</Button>
					<Button>Create new account</Button>
				</Grid>
			</Grid>
		</Collapse>
	);
};

export default Login;
