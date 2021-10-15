import { Grid, TextField } from '@mui/material';
import { useState } from 'react';
import RightSlider from './RightSlider';

const Login = () => {
	const [isSliderVisible, setIsSliderVisible] = useState(true);

	const loginVisibilityHandler = () => {
		setIsSliderVisible(false);
	};

	return (
		<div>
			{isSliderVisible === true && (
				<div style={{ float: 'right' }}>
					<Grid
						container
						spacing={1}
						alignContent="center"
						justifyContent="center"
						minHeight="100vh"
						width="60vh"
					>
						<RightSlider onClickHandler={loginVisibilityHandler} />
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<Grid item xs={12}>
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
				</div>
			)}
		</div>
	);
};

export default Login;
