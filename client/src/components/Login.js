import { Grid, TextField, Typography } from '@mui/material';
import RightSlider from './RightSlider';

const Login = (props) => {
	const loginSliderHandler = () => {
		props.loginSliderHandler();
	};

	return (
		<div>
			<div style={{ float: 'right' }}>
				<Grid
					container
					spacing={1}
					alignContent='center'
					justifyContent='center'
					minHeight='100vh'
					width='60vh'
				>
					<RightSlider
						style={{ zIndex: '2' }}
						onClickHandler={loginSliderHandler}
					/>

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							zIndex: 1,
						}}
					>
						<Typography
							style={{
								position: 'fixed',
								top: '3vh',
								width: '100%',
							}}
							variant='h4'
						>
							EEG WebReader
						</Typography>

						<Grid item xs={10}>
							<TextField
								fullWidth
								label='Email'
								variant='standard'
								margin='normal'
							></TextField>
							<TextField
								fullWidth
								label='Password'
								type='password'
								variant='standard'
								margin='normal'
							></TextField>
						</Grid>
					</div>
				</Grid>
			</div>
		</div>
	);
};

export default Login;
