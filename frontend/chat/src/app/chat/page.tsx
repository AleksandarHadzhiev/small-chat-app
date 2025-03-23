"use client"

import { FormEvent, useState } from "react";


export default function Home() {
    const [message, setMessage] = useState("")
    const email = localStorage.getItem("user")
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/' + email);

    // Event handler for when the connection is established
    socket.addEventListener('open', (event) => {
        console.log('Connected to server.');
    });

    // Event handler for receiving messages from the server
    socket.onmessage = (event) => {
        showMessage(event.data)
    }

    // Event handler for when the connection is closed
    socket.addEventListener('close', (event) => {
        console.log('Connection closed.');
    });

    function showMessage(message: string | null) {
        const messageContainer = document.getElementById('messages');
        const messageElement = document.createElement('p');
        messageElement.textContent = message
        messageContainer?.appendChild(messageElement)
    }

    function register(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(message)
        socket.send(message)
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div id="messages" className="w-full h-[94%] bg-black text-gray-200 overflow-auto">
            </div>
            <form onSubmit={(e) => { register(e) }} className="flex w-full bg-gray-900 text-white">
                <div className="flex w-full h-full">
                    <input
                        className="w-full h-full p-2"
                        type="text"
                        placeholder="Type..."
                        onChange={(e) => { setMessage(e.target.value) }} />
                </div>
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                </button>
            </form>
        </div>
    );
}
