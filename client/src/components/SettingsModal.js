import { Modal, Box, Typography, Paper, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Copy from './Copy';
import './Loader.css';

const edfdecoder = require('edfdecoder');

const SettingsModal = (props) => {
	const [files, setFiles] = useState([]);
	const [email, setEmail] = useState('');
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

			url = new URL('http://localhost:8000/api/v1/getHighlights');
			url.search = new URLSearchParams(params).toString();
			const res2 = await fetch(url);
			const json = await res2.json();

			props.setHighlights(json.highlights);

			const decoder = new edfdecoder.EdfDecoder();
			decoder.setInput(arrayBuffer);
			decoder.decode();
			const output = decoder.getOutput();
			props.uploadHandler(output);
			setLoadAnimation(false);
			closeHandler();
			navigate('/Reader/' + fileId);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteFile = async (fileId) => {
		try {
			let url = new URL('http://localhost:8000/api/v1/deleteFile');
			let params = { id: fileId };

			url.search = new URLSearchParams(params).toString();
			const res = await fetch(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				method: 'DELETE',
			});

			let newFileArray = files.filter((file) => {
				return file !== fileId;
			});
			setFiles(newFileArray);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (props.open) {
			let url = new URL('http://localhost:8000/api/v1/getUserFiles');
			let params = { email: localStorage.getItem('email') };
			url.search = new URLSearchParams(params).toString();
			fetch(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
				.then((res) => res.json())
				.then((result) => {
					setEmail(result.email);
					setFiles(result.fileIds);
				});
		}
	}, [props.userData, props.userFiles, props.open]);

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
				{email && (
					<Paper>
						<Typography
							style={{ margin: '1rem', borderBottom: '1px solid black' }}
							variant='h5'
						>
							Email: {email}
						</Typography>
						<Typography style={{ margin: '1rem' }}>Saved Files:</Typography>
						{files &&
							files.map((file) => {
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
										<Copy text={`${window.location.origin}/Reader/${file}`} />
										<Button onClick={() => selectFile(file)}>Select</Button>
										<Button onClick={() => deleteFile(file)}>Delete</Button>
									</Paper>
								);
							})}
						{files && files.length === 0 && (
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
