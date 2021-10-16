import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';

const UpperToolbar = (props) => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar>
				<Toolbar>
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1 }}
					>
						EEG WebReader
					</Typography>
					<Button color='inherit'>Login</Button>
					<Button color='inherit'>Register</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default UpperToolbar;
