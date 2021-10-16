import { createTheme, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import App from './App';

const theme = createTheme({
	palette: {
		primary: {
			main: '#121212',
		},
	},
	components: {
		MuiCollapse: {
			styleOverrides: {
				root: {
					float: 'right',
				},
			},
		},
	},
});

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<App />
	</ThemeProvider>,
	document.getElementById('root')
);
