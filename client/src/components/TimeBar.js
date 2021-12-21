import { useEffect, useState } from 'react';

const TimeBar = (props) => {
	const [pos, setPos] = useState(props.pos);
	const [val, setVal] = useState(props.val);

	useEffect(() => {
		setPos(props.pos);
		setVal(props.val);
	}, [props.pos, props.val]);

	return (
		<div>
			{val.map((v, index) => (
				<div
					style={{
						width: '2px',
						height: '15px',
						position: 'sticky',
						bottom: '5px',
						left: pos[index] + 'px',
					}}
				>
					{val[index]}
				</div>
			))}
		</div>
	);
};

export default TimeBar;
