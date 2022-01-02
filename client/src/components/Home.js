import { Grid } from '@mui/material';
import DragAndDrop from './DragAndDrop';
import Login from './Login';

const Home = (props) => {
	return (
		<Grid container direction='row'>
			<Grid item sx={{ flexGrow: 1 }}>
				<DragAndDrop uploadHandler={props.uploadHandler} />
			</Grid>
			<Grid item>
				<Login loginHandler={props.loginHandler}></Login>
			</Grid>
		</Grid>
	);
};

export default Home;
