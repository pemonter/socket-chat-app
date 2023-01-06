import {
  useState,
  useEffect,
  useContext,
  useRef,
  BaseSyntheticEvent,
  KeyboardEvent,
} from 'react'

import { Paperclip, PaperPlaneRight } from 'phosphor-react'

import { AudioRecContext } from '@contexts/AudioRecContext'
import { UserContext } from '@contexts/UserContext'

import { AudioRec } from '@components/AudioRec'
import { ChatBubble } from '@components/ChatBubble'

import { IMessage } from '../@types/message'

import io, { Socket } from 'socket.io-client'
let socket: Socket

export default function Room() {
  const { userName, userId } = useContext(UserContext)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<IMessage[]>([])
  const [file, setFile] = useState<File>({} as File)
  const { audioFile, isRecording, resetAudioFile } = useContext(AudioRecContext)

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  async function socketInitializer() {
    await fetch('/api/socket')

    socket = io(`http://localhost:8080`)

    socket.on('chat.message', (msg: IMessage) => {
      setMessages((currentMsg) => [...currentMsg, msg])
    })
  }

  useEffect(() => {
    socketInitializer()
  }, [])

  async function sendMessage() {
    const sendAt = new Date()

    if (audioFile.blob) {
      const messageObject = {
        authorId: userId,
        authorName: userName,
        body: audioFile.blob,
        mimeType: audioFile.type,
        fileName: audioFile.fileName,
        sendAt,
      } as IMessage

      socket.emit('chat.message', messageObject)
      setMessages((currentMsg) => [...currentMsg, messageObject])
      resetAudioFile()
      return
    }

    if (file.size) {
      const messageObject = {
        authorId: userId,
        authorName: userName,
        body: file,
        mimeType: file.type,
        fileName: file.name,
        sendAt,
      } as IMessage

      setMessage('')
      setFile({} as File)
      socket.emit('chat.message', messageObject)
      setMessages((currentMsg) => [...currentMsg, messageObject])

      return
    }

    const messageObject = {
      authorId: userId,
      authorName: userName,
      body: message,
      sendAt,
    } as IMessage

    setMessage('')
    socket.emit('chat.message', messageObject)
    setMessages((currentMsg) => [...currentMsg, messageObject])
  }

  function handleKeypress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (message) {
        sendMessage()
      }
    }
  }

  function handleSelectFile(e: BaseSyntheticEvent) {
    setMessage(e.target.files[0].name)
    setFile(e.target.files[0])
  }

  function renderMessages(message: IMessage) {
    const fileType = message.mimeType ? message.mimeType.split('/', 1)[0] : null

    if (fileType) {
      const blob = new Blob([message.body!], { type: message.mimeType })

      return (
        <ChatBubble
          key={String(message.sendAt) + message.authorId}
          authorId={message.authorId}
          authorName={message.authorName}
          body={null}
          fileName={message.fileName}
          blob={blob}
          fileType={fileType}
          sendAt={message.sendAt}
        />
      )
    } else {
      return (
        <ChatBubble
          key={String(message.sendAt) + message.authorId}
          authorId={message.authorId}
          authorName={message.authorName}
          body={message.body}
          sendAt={message.sendAt}
        />
      )
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const showAttachmentButton = !audioFile.blobURL && !isRecording
  const isEmptyMessage = !audioFile.blobURL && !message.length

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-gray-700">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        <p className="font-bold text-white text-xl">
          Your username: {userName}
        </p>
        <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md ">
          <div className="h-full last:border-b-0 overflow-y-scroll">
            {messages.map(renderMessages)}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-300 w-full flex rounded-bl-md">
            {!audioFile.blobURL && (
              <input
                type="text"
                placeholder="New message..."
                value={message}
                className="outline-none py-2 px-2 rounded-bl-md flex-1"
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeypress}
              />
            )}

            {showAttachmentButton && (
              <>
                <input
                  type="file"
                  onChange={handleSelectFile}
                  style={{ display: 'none' }}
                  id="icon-button-file"
                />

                <label
                  htmlFor="icon-button-file"
                  className="flex items-center mr-2 cursor-pointer"
                >
                  <Paperclip size={24} />
                </label>
              </>
            )}

            <AudioRec />

            <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-green-600 transition-all">
              <button
                className="group-hover:text-white px-3 h-full disabled:cursor-not-allowed"
                onClick={sendMessage}
                disabled={isEmptyMessage}
              >
                <PaperPlaneRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
