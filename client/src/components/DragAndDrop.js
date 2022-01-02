import { useDropzone } from 'react-dropzone';
import { useState, useMemo } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Typography } from '@mui/material';

const edfdecoder = require('edfdecoder');

const baseStyle = {
	flex: 1,
	display: 'flex',
	height: '100vh',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	borderRight: 'black solid 2px',
	backgroundColor: '#545454',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out',
};

const acceptStyle = {
	backgroundColor: '#00e676',
};

const rejectStyle = {
	backgroundColor: '#ff1744',
};

const DragAndDrop = (props) => {
	const [text, setText] = useState('Drag or click to upload an EDF file');
	const [isEdf, setIsEdf] = useState(false);
	const [isOtherFileType, setIsOtherFileType] = useState(false);
	//Because
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

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		maxFiles: 1,
		maxFileSize: 100,
		onDragEnter: (e) => {
			if (e.dataTransfer.items[0].type.length === 0) {
				setIsEdf(true);
			} else setIsOtherFileType(true);
		},
		onDragLeave: () => {
			setIsEdf(false);
			setIsOtherFileType(false);
		},
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
			return output;
		} catch (error) {
			console.log(error);
		}
	};

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isEdf ? acceptStyle : {}),
			...(isOtherFileType ? rejectStyle : {}),
		}),
		[isEdf, isOtherFileType]
	);

	const textHandler = async () => {
		setText('Unsupported file type');
		await new Promise((resolve) => setTimeout(resolve, 3000));
		setText('Drag or click to upload an EDF file');
	};

	return (
		<div {...getRootProps({ style })}>
			<input {...getInputProps()} />
			<FileUploadIcon fontSize='large' />
			<Typography>{text}</Typography>
		</div>
	);
};

export default DragAndDrop;
