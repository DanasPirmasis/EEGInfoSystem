import { useEffect, useState } from 'react';

const TimeBar = (props) => {
	const [pos, setPos] = useState(props.pos);
	const [val, setVal] = useState(props.val);

	useEffect(() => {
		setPos(props.pos);
		setVal(props.val);
	}, [props.pos, props.val]);

	return (
		<div style={{ display: 'contents' }}>
			{val.map((v, index) => (
				<div
					style={{
						position: 'fixed',
						width: '1rem',
						height: '10px',
						bottom: '5px',
						left: pos[index] + 'px',
						color: 'black',
						paddingLeft: '0.5rem',
					}}
				>
					{val[index]}
				</div>
			))}
		</div>
	);
};

export default TimeBar;
