"use client"

import { FormEvent, MouseEvent, useState } from "react";

//@ts-ignore
export default function Chat({ groupName }) {
    const [message, setMessage] = useState("")
    const email = localStorage.getItem("user")
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/' + email);

    // Event handler for when the connection is established
    socket.addEventListener('open', (event) => {
        console.log('Connected to server.');
        const contianer = document.getElementById("messages-" + groupName);
        if (contianer === null) {
            const messageContainer = document.getElementById('messages');
            const div = document.createElement('div');
            div.setAttribute("id", "messages-" + groupName)
            messageContainer?.appendChild(div)
        }
    });

    // Event handler for receiving messages from the server
    socket.onmessage = (event) => {
        console.log(event.data)
        showMessage(event.data)
    }

    // Event handler for when the connection is closed
    socket.addEventListener('close', (event) => {
        console.log('Connection closed.');
    });

    function showMessage(message: string) {
        const data = JSON.parse(message)
        if (data.group === groupName) {
            const messageContainer = document.getElementById("messages-" + groupName);
            const messageElement = document.createElement('p');
            if (messageContainer) {
                messageElement.textContent = data.content
                messageContainer.appendChild(messageElement)
            }

        }
    }

    function sendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        socket.send(JSON.stringify({ content: message, group: groupName }))
    }

    function join(e: any) {
        e.preventDefault()
        console.log(groupName)
        const content = {
            name: groupName,
            email: localStorage.getItem("user"),
        }
        console.log(content)
        fetch("http://127.0.0.1:8000/group/join", { method: "POST", body: JSON.stringify(content) })
            .then(async (res) => {
                if (res.status == 200) {
                    console.log(await res.json())
                }
                else {
                    alert("Unknown error")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }


    return (
        <div className="flex flex-col w-2/3 h-full">
            {groupName !== "" ? (
                <div className="h-full w-full">
                    <div className="w-full h-1/10 bg-gray-900 text-white">
                        <h1>{groupName}</h1>
                        <button
                            onClick={(e) => { join(e) }}
                            className="bg-gray-500 hover:bg-gray-700"
                        >Join
                        </button>
                    </div>
                    <div id="messages" className="w-full h-8/10 bg-black text-gray-200 overflow-auto">
                    </div>
                    <form onSubmit={(e) => { sendMessage(e) }} className="flex w-full h-1/10 bg-gray-900 text-white">
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
            ) : (
                <div>
                    <p>Loading ...</p>
                </div>
            )}
        </div>
    );
}
