import { Modal, Box, Typography, Paper, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loader.css';

const edfdecoder = require('edfdecoder');

const SettingsModal = (props) => {
	const [files, setFiles] = useState(props.userFiles);
	const [email, setEmail] = useState(props.userData);
	const [loadAnimation, setLoadAnimation] = useState(false);

	const navigate = useNavigate();

	const closeHandler = () => {
		props.settingsHandler(false);
	};

	const selectFile = async (fileId) => {
		try {
			let url = new URL('http://localhost:8000/api/v1/download');
			let params = { id: fileId };
			url.search = new URLSearchParams(params).toString();
			setLoadAnimation(true);
			const res = await fetch(url);
			const arrayBuffer = await res.arrayBuffer();

			const decoder = new edfdecoder.EdfDecoder();
			decoder.setInput(arrayBuffer);
			decoder.decode();
			const output = decoder.getOutput();
			props.uploadHandler(output);
			closeHandler();
			navigate('/Reader/' + fileId);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteFile = () => {
		console.log('file deleted');
	};

	useEffect(() => {
		setFiles(props.userFiles);
		setEmail(props.userData);
	}, [props.userData, props.userFiles]);

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
					width: '50vw',
					height: '50vh',
					boxShadow: 12,
					bgcolor: 'background.paper',
				}}
			>
				{props.userData && (
					<Paper>
						<Typography
							style={{ margin: '1rem', borderBottom: '1px solid black' }}
							variant='h5'
						>
							Email: {email}
						</Typography>
						<Typography style={{ margin: '1rem' }}>Saved Files:</Typography>
						{files.map((file) => {
							return (
								<Paper
									style={{
										margin: '1rem',
										display: 'flex',
										alignItems: 'center',
									}}
									key={file}
								>
									<Typography sx={{ flexGrow: 1 }}>{file}</Typography>
									<Button onClick={() => selectFile(file)}>Select</Button>
									<Button onClick={deleteFile}>Delete</Button>
								</Paper>
							);
						})}
						{files.length === 0 && (
							<Typography sx={{ flexGrow: 1 }}>No files found</Typography>
						)}
					</Paper>
				)}
				{loadAnimation && (
					<div style={{ width: '60px', height: '60px' }} className='loader' />
				)}
			</Box>
		</Modal>
	);
};

export default SettingsModal;
