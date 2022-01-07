import { Modal, Typography, Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

const MontageModal = (props) => {
	const [selectedSignals, setSelectedSignals] = useState([]);
	const [signSelectionMode, setSignSelectionMode] = useState(0);
	const [signals, setSignals] = useState([]);
	const [error, setError] = useState('');

	const selectSignal = (e) => {
		if (signSelectionMode === 0) {
			setSelectedSignals((selectedSignals) => [
				...selectedSignals,
				e.target.innerText,
			]);
			setSignSelectionMode(1);
		}
		if (signSelectionMode === 2) {
			const copyArray = [...selectedSignals];
			copyArray[copyArray.length - 1] =
				copyArray[copyArray.length - 1] + e.target.innerText;
			setSelectedSignals(copyArray);
			setSignSelectionMode(0);
		}
	};

	const selectPlusSign = () => {
		if (signSelectionMode === 1) {
			const copyArray = [...selectedSignals];
			copyArray[copyArray.length - 1] = copyArray[copyArray.length - 1] + ' + ';
			setSelectedSignals(copyArray);
			setSignSelectionMode(2);
		}
	};

	const selectMinusSign = () => {
		if (signSelectionMode === 1) {
			const copyArray = [...selectedSignals];
			copyArray[copyArray.length - 1] = copyArray[copyArray.length - 1] + ' - ';
			setSelectedSignals(copyArray);
			setSignSelectionMode(2);
		}
	};

	const removeSignal = (i) => {
		const swapArray = [...selectedSignals];

		if (i + 1 === swapArray.length) {
			setSignSelectionMode(0);
		}
		swapArray.splice(i, 1);
		setSelectedSignals(swapArray);
	};

	const closeHandler = () => {
		if (signSelectionMode !== 0) {
			setError('Please choose a valid derivation selection');
			setTimeout(() => {
				setError('');
			}, 10000);
		} else {
			props.handleClose(selectedSignals);
		}
	};

	useEffect(() => {
		setSelectedSignals([]);
		setSignSelectionMode(0);
		if (props.signals._header !== undefined)
			setSignals(props.signals._header.signalInfo);
		else setSignals([{ label: 'No signals found' }]);
	}, [props.signals]);

	return (
		<Modal
			open={props.open}
			onClose={closeHandler}
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
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography variant='h6' component='h2'>
						Choose signals for a montage
					</Typography>
					<IconButton onClick={closeHandler}>
						<CloseIcon htmlColor='black' fontSize='large' />
					</IconButton>
				</div>
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
					<Typography id='modal-modal-description'>Choose signals</Typography>
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
							maxHeight: '75vh',
							flexDirection: 'column',
							width: '15vw',
							border: '1px solid black',
							borderBottomWidth: '0px',
							borderLeftWidth: '0px',
							overflow: 'auto',
						}}
					>
						{signals.map((signal, index) => (
							<li
								key={signal.label + index + 'li'}
								style={{ listStyleType: 'none', maxWidth: '7vw' }}
							>
								{signal.label !== 'No signals found' && (
									<Button
										onClick={selectSignal}
										style={{ minWidth: '7vw' }}
										key={signal.label + index}
									>
										{signal.label}
									</Button>
								)}
								{signal.label === 'No signals found' && (
									<p key={'none'}>{signal.label}</p>
								)}
							</li>
						))}
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<span style={{ color: 'red' }}>{error}</span>
						<IconButton
							style={{ marginTop: 'auto', marginBottom: 'auto' }}
							onClick={selectPlusSign}
						>
							<AddIcon color='primary' fontSize='large' />
						</IconButton>
						<IconButton
							style={{ marginTop: 'auto', marginBottom: 'auto' }}
							onClick={selectMinusSign}
						>
							<RemoveIcon color='primary' fontSize='large' />
						</IconButton>
						<Button
							variant='outlined'
							style={{ marginTop: 'auto', marginBottom: '0.5rem' }}
							onClick={closeHandler}
						>
							Make Derivation
						</Button>
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
