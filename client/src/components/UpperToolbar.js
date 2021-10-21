import { AppBar, Button, Fade, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UpperToolbar = (props) => {
	return (
		<Fade in={props.appear} timeout={1000}>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar sx={{ backgroundColor: '#121212' }}>
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							EEG WebReader
						</Typography>

						<Typography sx={{ marginRight: '1rem' }}>Guest User</Typography>
						<AccountCircleIcon
							sx={{ transform: 'scale(1.8)', marginRight: '1rem' }}
						></AccountCircleIcon>
						<Button
							variant="outlined"
							color="inherit"
							sx={{ marginLeft: '1rem' }}
						>
							Login
						</Button>
						<Button
							variant="outlined"
							color="inherit"
							sx={{ marginRight: '1rem', marginLeft: '1rem' }}
						>
							Help
						</Button>
					</Toolbar>
				</AppBar>
			</Box>
		</Fade>
	);
};

export default UpperToolbar;
