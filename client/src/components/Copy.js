import { Button } from '@mui/material';
import { useState } from 'react';
const Copy = (props) => {
	const [isCopied, setIsCopied] = useState(false);

	const copyTextToClipboard = async (text) => {
		if ('clipboard' in navigator) {
			return await navigator.clipboard.writeText(text);
		} else {
			return navigator.clipboard.writeText(text);
		}
	};

	const handleCopyClick = () => {
		copyTextToClipboard(props.text)
			.then(() => {
				setIsCopied(true);
				setTimeout(() => {
					setIsCopied(false);
				}, 1500);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<div>
			<Button onClick={handleCopyClick}>
				{isCopied ? 'Copied!' : 'Copy Link'}
			</Button>
		</div>
	);
};

export default Copy;
