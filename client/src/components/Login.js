import { Collapse, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import RightSlider from './RightSlider';

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
				spacing={1}
				alignContent="center"
				justifyContent="center"
				width="40vw"
				maxHeight="100vh"
			>
				<RightSlider onClickHandler={loginSliderHandler} />
				<div
					style={{
						display: 'grid',
						justifyContent: 'center',
						alignContent: 'center',
					}}
				>
					<Grid item xs={10}>
						<Typography variant="h4">EEG WebReader</Typography>
					</Grid>
					<Grid item xs={10}>
						<TextField
							fullWidth
							label="Email"
							variant="standard"
							margin="normal"
						></TextField>
						<TextField
							fullWidth
							label="Password"
							type="password"
							variant="standard"
							margin="normal"
						></TextField>
					</Grid>
				</div>
			</Grid>
		</Collapse>
	);
};

export default Login;
