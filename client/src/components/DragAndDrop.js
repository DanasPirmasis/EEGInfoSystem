import Dropzone, { useDropzone } from 'react-dropzone';
import { useCallback, useMemo } from 'react';
import edfdecoder from 'edfdecoder';

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
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
	borderColor: '#ff1744',
};

const DragAndDrop = () => {
	// const onDrop = useCallback((acceptedFiles) => {
	// 	const buffer = acc

	//     var decoder = new edfdecoder.EdfDecoder();
	//     decoder.setInput(buffer);
	//     decoder.decode();
	//     var output = decoder.getOutput();
	// }, []);

	// const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		accept: '.edf',
		onDrop: (acceptedFiles) => {
			console.log(acceptedFiles);
		},
		onDropRejected: () => {
			console.log('file rejected');
		},
	});

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isDragActive, isDragReject, isDragAccept]
	);

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	return (
		<section
			style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
		>
			<div {...getRootProps({ style })}>
				<input {...getInputProps()} />
				<p>Drag 'n' drop some files here, or click to select files</p>
			</div>
		</section>
	);
};

export default DragAndDrop;
