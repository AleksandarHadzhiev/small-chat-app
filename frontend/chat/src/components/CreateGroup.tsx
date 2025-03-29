"use client"

import { FormEvent, useState } from "react"

//@ts-ignore
export default function CreateGroup({ setGroupAdded, setIsToAddGroup }) {

    const [name, setName] = useState("")

    function createGroup(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(name)
        const content = {
            name: name,
            email: localStorage.getItem("user"),
            type: "private",
        }
        console.log(content)
        fetch("http://127.0.0.1:8000/", { method: "POST", body: JSON.stringify(content) })
            .then(async (res) => {
                if (res.status == 200) {
                    console.log(await res.json())
                    setGroupAdded(name)
                    setIsToAddGroup(false)
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
        <div className="flex justify-center items-center w-full h-full">

            <form onSubmit={(e) => { createGroup(e) }} className="flex flex-col justify-center space-y-3 items-center w-86 h-86 bg-[#2a2a2a] text-white">
                <h1>Create Group</h1>
                <div className="flex flex-col">
                    <label className="text-white">Name:</label>
                    <input
                        className="text-center border-b border-white placeholder-white text-white"
                        type="text"
                        placeholder="name"
                        onChange={(e) => { setName(e.target.value) }} />
                </div>
                <button className="bg-gray-500 w-24 ju hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
            </form>
        </div>
    )
}