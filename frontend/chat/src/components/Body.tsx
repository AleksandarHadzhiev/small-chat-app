import { useEffect, useState } from "react";
import Chat from "./ChatPage";
import Sidebar from "./Sidebar";

//@ts-ignore
export default function Body({ groups, setIsToAddGroup }) {
    const [name, setName] = useState("")
    useEffect(() => {
        removeUnnededContent()
        if (name != "") {
            getMessages()
        }

    }, [name])

    function removeUnnededContent() {
        console.log("REMOVED")
        const messageContainer = document.getElementById('messages');
        messageContainer?.replaceChildren()
    }

    function getMessages() {
        fetch("http://127.0.0.1:8000/" + name + "/messages", { method: "GET" })
            .then(async (res) => {
                if (res.status == 200) {
                    const data = await res.json()
                    data.messages
                    await displayMessages(data.messages)
                }
                else {
                    alert("Unknown error") // fix to proper handling 
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function displayMessages(messages: any) {
        const messageContainer = document.getElementById('messages');
        const div = document.createElement('div');
        div.setAttribute("id", "messages-" + name)
        if (messages) {
            messages.forEach((message: any) => {
                const messageElement = document.createElement('p');
                messageElement.textContent = message
                div?.append(messageElement)
            });
        }
        messageContainer?.appendChild(div)
    }
    return (
        <div className="w-full flex h-full">
            <Sidebar groups={groups} setName={setName} setIsToAddGroup={setIsToAddGroup} />
            <Chat groupName={name} />
        </div>
    )
}