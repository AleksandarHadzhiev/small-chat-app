"use client"

import { FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("")

  function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    fetch("http://127.0.0.1:8000/" + email, { method: "POST" })
      .then(async (res) => {
        if (res.status == 200) {
          localStorage.setItem("user", email)
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
    <div className="flex justify-center items-centeralign-center w-full h-full">
      <form onSubmit={(e) => { register(e) }} className="flex flex-col justify-center space-y-3 items-center w-86 h-86 bg-white text-black">
        <div className="flex flex-col">
          <label className="text-gray-700">Email:</label>
          <input
            className="text-center border border-blue-500 placeholder-black"
            type="email"
            placeholder="example@gmail.com"
            onChange={(e) => { setEmail(e.target.value) }} />
        </div>
        <button className="bg-blue-500 w-24 ju hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
      </form>
    </div>
  );
}
