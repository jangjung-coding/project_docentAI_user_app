import React, { useState } from 'react';

function goghChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const newMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            const response = await fetch('http://localhost:5000/gogh', {  // 수정된 URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: input }),  // JSON 형식으로 메시지 전송
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage = { sender: 'bot', text: data.response || 'No response from server' };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } else {
                const botMessage = { sender: 'bot', text: 'Error: Could not retrieve response from server.' };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            }
        } catch (error) {
            const botMessage = { sender: 'bot', text: 'Error: Network error occurred.' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }

        setInput('');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            textAlign: message.sender === 'user' ? 'right' : 'left',
                            margin: '10px 0',
                        }}
                    >
                        <strong>{message.sender === 'user' ? 'You: ' : 'Bot: '}</strong>
                        {message.text}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ccc' }}
                />
                <button onClick={sendMessage} style={{ padding: '10px' }}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default goghChat;
