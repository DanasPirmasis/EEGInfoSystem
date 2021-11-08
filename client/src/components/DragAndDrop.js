import { useDropzone } from 'react-dropzone';
import { useState, useMemo } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Fade, Typography } from '@mui/material';

const edfdecoder = require('edfdecoder');

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	borderRight: 'black solid 2px',
	backgroundColor: '#545454',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out',
};

const activeStyle = {
	borderColor: '#2196f3',
};

const acceptStyle = {
	borderColor: '#00e676',
};

const rejectStyle = {
	backgroundColor: '#ff1744',
};

const DragAndDrop = (props) => {
	const [text, setText] = useState('Drag or click to upload an EDF file');

	const onDrop = (acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				const binaryStr = reader.result;
				const outputFile = decodeEdfFile(binaryStr);
				props.uploadHandler(outputFile);
			};
			reader.readAsArrayBuffer(file);
		});
	};

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,
		accept: '.edf',
		maxFiles: 1,
		maxFileSize: 100,
		onDropRejected: () => {
			textHandler();
		},
	});

	const decodeEdfFile = (file) => {
		try {
			const decoder = new edfdecoder.EdfDecoder();
			decoder.setInput(file);
			decoder.decode();
			const output = decoder.getOutput();
			console.log(output);
			return output;
		} catch (error) {
			console.log(error);
		}
	};

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isDragActive, isDragReject, isDragAccept]
	);

	const textHandler = async () => {
		setText('Unsupported file type');
		await new Promise((resolve) => setTimeout(resolve, 3000));
		setText('Drag or click to upload an EDF file');
	};

	return (
		<Fade
			in={props.appear}
			timeout={{ enter: 0, exit: 200 }}
			unmountOnExit={true}
		>
			<section
				style={{
					display: 'flex',
					flexDirection: 'row',
					minHeight: '100vh',
				}}
			>
				<div {...getRootProps({ style })}>
					<input {...getInputProps()} />
					<FileUploadIcon fontSize="large" />
					<Typography>{text}</Typography>
				</div>
			</section>
		</Fade>
	);
};

export default DragAndDrop;
