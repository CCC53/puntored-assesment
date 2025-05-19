import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { CopyBlockProps } from '../utils/types/components/components';

export default function CopyBlock({ text }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        overflowX: 'auto',
      }}
    >
      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {text}
      </Typography>
      <Tooltip title={copied ? 'Copied!' : 'Copy'}>
        <IconButton
          onClick={handleCopy}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          aria-label="Copy to clipboard"
        >
          {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}