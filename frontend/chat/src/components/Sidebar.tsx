"use client"

import { Key } from "react"

//@ts-ignore
export default function Sidebar({ groups, setName, setIsToAddGroup }) {
    return (
        <div className="w-1/3 h-full flex flex-col">
            <p>There are groups: </p>
            <div>
                <button onClick={() => {
                    setIsToAddGroup(true)
                }}>Add group</button>
            </div>
            <ul className="space-y-2 font-medium">
                {groups.map((group: string, index: Key | null | undefined) => (
                    <li onClick={() => { setName(group) }} key={index} className="border-b-2 border-t-2 border-gray-700 hover:bg-sky-400">
                        {group}
                    </li>
                ))}
            </ul>
        </div>
    )
}