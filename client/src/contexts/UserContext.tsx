import { createContext, ReactNode, useEffect, useState } from 'react'

import { v4 as uuidV4 } from 'uuid'

interface UserContextType {
  userId: string
  userName: string
  setUserName: (userName: string) => void
}

export const UserContext = createContext({} as UserContextType)

interface UserContextProviderProps {
  children: ReactNode
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || uuidV4())
    setUserName(localStorage.getItem('userName') || '')
  }, [])

  useEffect(() => {
    localStorage.setItem('userName', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('userId', userId)
  }, [userId])

  return (
    <UserContext.Provider
      value={{
        userId,
        userName,
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
