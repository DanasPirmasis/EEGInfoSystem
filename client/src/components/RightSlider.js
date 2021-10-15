import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Avatar } from '@mui/material';

const RightSlider = (props) => {
	const clickHandler = () => {
		props.onClickHandler();
	};

	return (
		<div
			style={{
				position: 'absolute',
				height: '100%',
				right: '28vw',
				borderLeft: 'solid black 1px',
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
		</div>
	);
};

export default RightSlider;
