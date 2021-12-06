import { Modal, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';

const MontageModal = (props) => {
	const [selectedSignals, setSelectedSignals] = useState([]);
	const [selectedSignalsLength, setSelectedSignalsLength] = useState(0);
	//Weird solution probably should fix it LOL!
	//selectSignal and removeSignal probably have lots of spaghet, this logic should be revisited!
	const selectSignal = async (e) => {
		if (selectedSignalsLength === 0 || selectedSignalsLength % 2 === 0) {
			setSelectedSignals((selectedSignals) => [
				...selectedSignals,
				e.target.innerText,
			]);
		} else {
			const swapArray = selectedSignals;
			swapArray[swapArray.length - 1] =
				swapArray[swapArray.length - 1] + ' - ' + e.target.innerText;
			setSelectedSignals(swapArray);
		}

		const val = selectedSignalsLength + 1;
		setSelectedSignalsLength(val);
	};

	const removeSignal = (i) => {
		let lengthReducer = selectedSignalsLength - 1;
		const swapArray = [...selectedSignals];
		if (swapArray[i].includes(' - ')) {
			console.log('reducd by two');
			lengthReducer--;
		}
		swapArray.splice(i, 1);
		setSelectedSignals(swapArray);
		setSelectedSignalsLength(lengthReducer);
	};

	const closeHandler = () => {
		props.handleClose(selectedSignals);
	};

	return (
		<Modal
			open={props.open}
			onClose={closeHandler}
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
						{selectedSignals.map((signal, i) => (
							<li
								style={{ listStyleType: 'none', minWidth: '15vw', key: { i } }}
							>
								<Button
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										removeSignal(i);
									}}
									style={{ minWidth: '15vw' }}
								>
									{signal}
								</Button>
							</li>
						))}
					</div>
				</div>
			</Box>
		</Modal>
	);
};

export default MontageModal;
