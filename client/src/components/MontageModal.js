import { Modal, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';

const MontageModal = (props) => {
	const [selectedSignals, setSelectedSignals] = useState([]);
	//const [currentSelectedSignal, setCurrentSelectedSignal] = useState([]);

	const selectSignal = async (e) => {
		setSelectedSignals((selectedSignals) => [
			...selectedSignals,
			<li style={{ listStyleType: 'none', minWidth: '7.5vw' }}>
				<Button onClick={removeSignal} style={{ minWidth: '7.5vw' }}>
					{e.target.innerText}
				</Button>
			</li>,
		]);
		console.log(selectedSignals);
	};
	// Instead of adding elements to the state we can use a map function that for each text value adds an element
	// And in the selectSignal function it should just be adding the innerText value to selectedSignalsState
	const removeSignal = () => {};

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
						flexWrap: 'wrap',
						justifyContent: 'space-between',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							flexDirection: 'column',
							maxHeight: '75vh',
							maxWidth: '15vw',
							minWidth: '15vw',
							border: '1px solid black',
							borderBottomWidth: '0px',
							borderLeftWidth: '0px',
							overflow: 'auto',
						}}
					>
						{props.signals.map((signal) => (
							<li
								style={{ listStyleType: 'none', maxWidth: '7vw' }}
								key={signal.label}
							>
								<Button onClick={selectSignal} style={{ minWidth: '7vw' }}>
									{signal.label}
								</Button>
							</li>
						))}
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							border: '1px solid black',
							minWidth: '15vw',
							maxWidth: '15vw',
							justifyContent: 'flex-start',
							alignContent: 'flex-start',
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
