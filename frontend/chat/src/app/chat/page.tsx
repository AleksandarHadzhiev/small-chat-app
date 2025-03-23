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
        <div className="flex flex-col justify-center items-centeralign-center w-full h-full">
            <form onSubmit={(e) => { register(e) }} className="flex flex-col justify-center space-y-3 items-center w-86 h-86 bg-white text-black">
                <div className="flex flex-col">
                    <label className="text-gray-700">Message:</label>
                    <input
                        className="text-center border border-blue-500 placeholder-black"
                        type="text"
                        placeholder="Hi..."
                        onChange={(e) => { setMessage(e.target.value) }} />
                </div>
                <button className="bg-blue-500 w-24 ju hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
            </form>
            <div id="messages" className="w-86 h-86 bg-red-900 text-white">
            </div>
        </div>
    );
}
