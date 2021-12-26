import { Button, Modal, Paper, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';

const SaveModal = (props) => {
	const [highlights, setHighlights] = useState(props.newHighlights);
	const [approvedHighlights, setApprovedHighlights] = useState([]);
	const [approvedIndexes, setApprovedIndexes] = useState([]);

	const closeHandler = () => {
		props.handleClose();

		setApprovedIndexes([]);
		setApprovedHighlights([]);
	};

	const addHighlight = (highlight, index) => {
		console.log(highlight);
		if (approvedIndexes.indexOf(index) === -1) {
			setApprovedIndexes((approvedIndexes) => [...approvedIndexes, index]);
			setApprovedHighlights((approvedHighlights) => [
				...approvedHighlights,
				highlight,
			]);
		}
	};

	const removeHighlight = (highlight, index) => {
		let tempAppHighl = approvedHighlights;
		let tempAppHighlIdx = approvedIndexes;
		tempAppHighl = tempAppHighl.filter((val) => {
			return val !== highlight;
		});

		tempAppHighlIdx = tempAppHighlIdx.filter((val) => {
			return val !== index;
		});
		setApprovedHighlights(tempAppHighl);
		setApprovedIndexes(tempAppHighlIdx);
		props.removeNewHighlight(highlight);
	};

	useEffect(() => {
		setHighlights(props.newHighlights);
	}, [props.newHighlights]);

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
					height: '50vh',
					border: '1px solid #000',
					boxShadow: 12,
					bgcolor: 'background.paper',
				}}
			>
				{highlights.map((highlight, index) => {
					return (
						<Paper
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '0.5rem',
							}}
						>
							<Typography style={{ marginLeft: '1rem' }}>
								{index + 1}
							</Typography>
							<Typography style={{ marginLeft: '1rem' }} sx={{ flexGrow: 1 }}>
								{highlight.signalNumber +
									' Range: ' +
									highlight.valueRange[0] +
									' - ' +
									highlight.valueRange[1]}
							</Typography>
							<Button onClick={() => addHighlight(highlight, index + 1)}>
								Add
							</Button>
							<Button onClick={() => removeHighlight(highlight, index + 1)}>
								Remove
							</Button>
						</Paper>
					);
				})}
				{approvedIndexes.length > 0 && (
					<Paper style={{ marginTop: '0.5rem' }}>
						<Typography>
							Approved highlights: {approvedIndexes.toString()}
						</Typography>
					</Paper>
				)}

				{highlights.length === 0 && (
					<Box
						style={{
							display: 'flex',
							width: '100%',
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						No highlights are currently selected
					</Box>
				)}
				<Box
					style={{
						display: 'flex',
						justifyItems: 'flex-end',
						marginTop: 'auto',
					}}
				>
					<Button
						variant='outlined'
						sx={{ width: '100%' }}
						onClick={closeHandler}
					>
						Close
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default SaveModal;
