import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Avatar } from '@mui/material';
import { Box } from '@mui/system';

const RightSlider = (props) => {
	const clickHandler = () => {
		props.onClickHandler();
	};

	return (
		<Box
			style={{
				position: 'relative',
				display: 'flex',
				justifyContent: 'flex-end',
				borderLeft: 'solid black 1px',
				height: '100vh',
			}}
		>
			<Avatar
				sx={{
					backgroundColor: 'white',
					transform: 'scale(1.8)',
					top: '50%',
					paddingRight: '2vw',
				}}
			>
				<KeyboardArrowRightIcon
					style={{ transform: 'scale(1.8)', color: 'black' }}
					fontSize="large"
					onClick={clickHandler}
				/>
			</Avatar>
		</Box>
	);
};

export default RightSlider;
