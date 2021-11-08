import {
	Button,
	Grid,
	TextField,
	Typography,
	InputAdornment,
	Fade,
} from '@mui/material';
import { AccountCircle, LockRounded } from '@mui/icons-material';

const Login = (props) => {
	const loginSliderHandler = () => {
		props.loginSliderHandler();
	};

	return (
		<Fade
			in={props.appear}
			timeout={{ enter: 0, exit: 200 }}
			unmountOnExit={true}
		>
			<Grid
				container
				display="flex"
				flexDirection="column"
				spacing={1}
				alignContent="center"
				justifyContent="center"
				width="35vw"
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

					<Button
						sx={{ marginTop: '20px' }}
						variant="contained"
						onClick={loginSliderHandler}
					>
						Login
					</Button>
					<Button sx={{ marginTop: '20px', marginLeft: '20px' }}>
						Create new account
					</Button>
				</Grid>
			</Grid>
		</Fade>
	);
};

export default Login;
