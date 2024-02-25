import Box from '@mui/material/Box';
import React from 'react';

interface ChatMessageProps {
    fontSize: number;
    name: string;
    message: string;
    highlight?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ fontSize, name, message, highlight }) => {
    return (
        <Box 
        sx={{ 
            fontSize: {xs: fontSize * 0.7 + 'px', sm: fontSize + 'px'},
            lineHeight: {xs: fontSize * 0.7 + 'px', sm: fontSize + 'px'},
            opacity: highlight ? 1 : 0.7,
         }}
        >
            <strong>{name}: </strong> {message}
        </Box>
    );
};

export default ChatMessage;