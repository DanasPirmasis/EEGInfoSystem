import { Grid, TextField } from '@mui/material';
const Login = () => {
	return (
		<Grid
			container
			spacing={1}
			alignContent='center'
			justifyContent='flex-end'
			minHeight='100vh'
		>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Grid item xs={6}>
					<TextField
						fullWidth
						label='Email'
						variant='standard'
						margin='normal'
					></TextField>
					<TextField
						label='Password'
						type='password'
						variant='standard'
						margin='normal'
					></TextField>
				</Grid>
			</div>
		</Grid>
	);
};

export default Login;
