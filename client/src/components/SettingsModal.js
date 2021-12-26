import { Modal, Box, Typography, Paper, Button } from '@mui/material';
import { useState, useEffect } from 'react';

const SettingsModal = (props) => {
	const [files, setFiles] = useState(props.userFiles);

	const closeHandler = () => {
		props.settingsHandler(false);
	};

	const selectFile = () => {
		console.log('file selected');
	};

	const deleteFile = () => {
		console.log('file deleted');
	};

	useEffect(() => {
		setFiles(props.userFiles);
	}, [props.userFiles]);

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
					boxShadow: 12,
					bgcolor: 'background.paper',
				}}
			>
				{props.userData && (
					<Paper>
						<Typography>Email: {props.userData.email}</Typography>
						<Typography>Saved Files:</Typography>
						{files.map((file) => {
							return (
								<Paper>
									<Typography sx={{ flexGrow: 1 }}>{file.title}</Typography>
									<Button onClick={selectFile}>Select</Button>
									<Button onClick={deleteFile}>Delete</Button>
								</Paper>
							);
						})}
					</Paper>
				)}
			</Box>
		</Modal>
	);
};

export default SettingsModal;
