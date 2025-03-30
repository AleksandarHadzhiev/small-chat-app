"use client"

import { Key } from "react"

//@ts-ignore
export default function Sidebar({ groups, setName, setIsToAddGroup }) {
    return (
        <div className="w-1/4 h-full flex flex-col bg-gray-900">
            <p>Groups </p>
            <div>
                <button className="w-full bg-gray-700 hover:bg-gray-400 rounded-xl mb-2" onClick={() => {
                    setIsToAddGroup(true)
                }}>Add group</button>
            </div>
            <ul className="space-y-2 w-full font-medium">
                {groups.map((group: string, index: Key | null | undefined) => (
                    <li onClick={() => { setName(group) }} key={index} className="border-b-2 border-t-2 bg-gray-700 border-gray-500 hover:bg-gray-400 text-center">
                        {group}
                    </li>
                ))}
            </ul>
        </div>
    )
}