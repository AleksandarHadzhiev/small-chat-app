import { useEffect, useState } from "react"
import CreateGroup from "./CreateGroup"
import Body from "./Body"


export default function FullBody() {

    const [groupAdded, setGroupAdded] = useState("")
    const [groups, setGroups] = useState([])
    const [isToAddGroup, setIsToAddGroup] = useState(false)

    useEffect(() => {
        fetch("http://127.0.0.1:8000/groups", { method: "GET" })
            .then(async (res) => {
                if (res.status == 200) {
                    const data = await res.json()
                    setGroups(data.groups)
                }
                else {
                    alert("Unknown error") // fix to proper handling 
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [groupAdded])

    return (
        <div className="w-full flex flex-col h-full">
            {groups.length === 0 || isToAddGroup ? (
                <CreateGroup setGroupAdded={setGroupAdded} setIsToAddGroup={setIsToAddGroup} />
            ) : (
                <Body groups={groups} setIsToAddGroup={setIsToAddGroup} />
            )}
        </div>
    )
}