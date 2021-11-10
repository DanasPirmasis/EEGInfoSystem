import { Modal, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';

const MontageModal = (props) => {
	const [selectedSignals, setselectedSignals] = useState([]);

	const selectSignal = (e) => {
		console.log(e.target.innerText);
		setselectedSignals((selectedSignals) => [
			...selectedSignals,
			<li>{e.target.innerText}</li>,
		]);
	};

	return (
		<Modal
			open={props.open}
			onClose={props.handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '45vw',
					border: '1px solid #000',
					boxShadow: 12,
					bgcolor: 'background.paper',
				}}
			>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					Choose signals for a montage
				</Typography>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						paddingTop: '10px',
						paddingBottom: '10px',
					}}
				>
					<Typography id="modal-modal-description">Choose signals</Typography>
					<Typography sx={{ paddingRight: '6.3vw' }}>Derivation</Typography>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'flex-start',
						justifyContent: 'space-between',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'column',
							maxHeight: '75vh',
							border: '1px solid black',
							borderBottomWidth: '0px',
							borderLeftWidth: '0px',
							minWidth: '12vw',
							overflow: 'auto',
						}}
					>
						{props.signals.map((signal) => (
							<li style={{ listStyleType: 'none' }} key={signal.label}>
								<Button
									onClick={selectSignal}
									sx={{ padding: '3px', flexGrow: 1 }}
								>
									{signal.label}
								</Button>
							</li>
						))}
					</div>
					<div
						style={{
							display: 'flex',
							border: '1px solid black',
						}}
					>
						{selectedSignals}
					</div>
				</div>
			</Box>
		</Modal>
	);
};

export default MontageModal;
