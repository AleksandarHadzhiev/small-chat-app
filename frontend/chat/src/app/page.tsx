"use client"

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(email)
    fetch("http://127.0.0.1:8000/" + email, { method: "POST" })
      .then(async (res) => {
        if (res.status == 200) {
          localStorage.setItem("user", email)
          router.push('/chat')
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
      <form onSubmit={(e) => { register(e) }} className="flex flex-col justify-center space-y-3 items-center w-86 h-86 bg-[#2a2a2a] text-black">
        <div className="flex flex-col">
          <label className="text-white">Email:</label>
          <input
            className="text-center border-b border-white placeholder-white text-white"
            type="email"
            placeholder="example@gmail.com"
            onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        <button className="bg-gray-500 w-24 ju hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
      </form>
    </div>
  );
}
