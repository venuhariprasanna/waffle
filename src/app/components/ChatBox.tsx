import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface ChatBoxProps {
    userId: string;
    addMessage: (message: string) => void;
    userInput: string;
    setUserInput: (input: string) => void;
    allowInput?: boolean;
    fontScaleFactor: number;
    headerHeight: number;
}

const similarityToFontSize = (similarity: number, fontScaleFactor: number) => {
    return 20 - fontScaleFactor + (similarity + 0.5) * fontScaleFactor;
}

const shouldHighlight = (similarity: number) => {
    const threshold = 0.3;
    return similarity > threshold;
}

const ChatBox: React.FC<ChatBoxProps> = ({ userId, addMessage, userInput, setUserInput, allowInput, fontScaleFactor, headerHeight}) => {
    const messages = useQuery(api.messages.getMessagesWithRelativeSimilarity, {
        userId: userId,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages, fontScaleFactor]); // Dependency array ensures this runs only when messages change

    if (!messages) {
        
        return <div>Loading...</div>;
    }

    return (
        <div className='w-full md:w-3/4 lg:w-2/3 flex flex-col'>
            <div className='flex flex-col flex-grow'
                style={{
                    maxHeight: `calc(100vh - ${headerHeight + 64 + 130}px)`, // `calc(100vh - 64px)`,
                    overflowY: 'scroll',
                }}
            >
                {messages.map((message, i) => (
                    <ChatMessage
                        key={i}
                        fontSize={similarityToFontSize(message.similarity, fontScaleFactor)}
                        name={message.name}
                        message={message.message}
                        highlight={shouldHighlight(message.similarity)}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
                <ChatInput
                    userInput={userInput}
                    setUserInput={setUserInput}
                    send={() => {
                        setUserInput('')
                        addMessage(userInput)
                    }}
                    allowInput={allowInput}
                />
        </div >
    );
};

export default ChatBox;