import { Input } from '@mui/material';
import React, { useState } from 'react';

interface Props {
    username: string;
    setUsername: (username: string) => void;
}

export const UsernameInput: React.FC<Props> = ({ username, setUsername }) => {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                setUsername(username);
            }}
        >
            <Input
                type="text"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your name..."
                value={username}
                // sx={{ width: 50 }}
                sx={
                    username === "" ?
                        { fontWeight: "bold", color: "red" }
                        :
                        {}
                }
            />
        </form>
    );
}