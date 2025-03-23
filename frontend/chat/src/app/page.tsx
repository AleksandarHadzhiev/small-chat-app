export default function Home() {
  return (
    <div className="flex justify-center items-centeralign-center w-full h-full">
      <form className="flex flex-col justify-center space-y-3 items-center w-86 h-86 bg-white text-black">
        <div className="flex flex-col">
          <label className="text-gray-700">Email:</label>
          <input className="text-center border border-blue-500 placeholder-black" type="email" placeholder="example@gmail.com" />
        </div>
        <button className="bg-blue-500 w-24 ju hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Submit</button>
      </form>
    </div>
  );
}
