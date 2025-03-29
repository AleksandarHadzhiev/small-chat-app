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
                messageContainer?.append(messageElement)
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
        <div className="flex flex-col w-3/4 h-full">
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
                <div className="w-full h-full flex justify-center items-center align-center" role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </div>
    );
}
