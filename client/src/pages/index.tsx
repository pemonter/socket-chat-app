import { useContext } from 'react'

import Link from 'next/link'

import { UserContext } from '@contexts/UserContext'

export default function Home() {
  const { userName, setUserName } = useContext(UserContext)

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-gray-700">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        <h3 className="font-bold text-white text-xl">
          Hey! How people should call you? 😁
        </h3>
        <div className="flex gap-2 content-center justify-center max-w-screen-md">
          <input
            type="text"
            placeholder="Identity..."
            value={userName}
            className="py-2 px-2 rounded-md outline-none flex-1"
            onChange={(e) => setUserName(e.target.value)}
          />

          <Link
            href="/room"
            className="py-2 px-4 bg-green-700 rounded text-white hover:bg-green-600 self-center"
          >
            Enter room
          </Link>
        </div>
      </main>
    </div>
  )
}
