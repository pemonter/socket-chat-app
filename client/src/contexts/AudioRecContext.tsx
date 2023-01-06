import { createContext, ReactNode, useEffect, useState } from 'react'

import MicRecorder from 'mic-recorder-to-mp3'

const recorder = new MicRecorder({ bitRate: 128 })

interface AudioFileData {
  blob: string
  blobURL: string
  type: string
  fileName: string
}

interface AudioStatusData {
  isRecording: boolean
  blobURL: string
  isBlocked: boolean
  type?: string
}

interface AudioRecContextType {
  isRecording: boolean
  audioFile: AudioFileData
  startRec: () => void
  stopRec: () => void
  resetAudioFile: () => void
}

export const AudioRecContext = createContext({} as AudioRecContextType)

interface AudioRecContextProviderProps {
  children: ReactNode
}

export function AudioRecContextProvider({
  children,
}: AudioRecContextProviderProps) {
  const [audioFile, setAudioFile] = useState({} as AudioFileData)
  const [audioStatusData, setAudioStatusData] = useState<AudioStatusData>({
    isRecording: false,
    blobURL: '',
    isBlocked: false,
  } as AudioStatusData)
  const [isRecording, setIsRecording] = useState(false)

  function getUserMedia() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioStatus = {
          isRecording: false,
          blobURL: '',
          isBlocked: false,
        }

        setAudioStatusData(audioStatus)
      })
      .catch((err) => {
        alert(err.message)

        const audioStatus = {
          isRecording: false,
          blobURL: '',
          isBlocked: true,
        }

        setAudioStatusData(audioStatus)
      })
  }

  useEffect(() => {
    getUserMedia()
  }, [])

  function startRec() {
    if (audioStatusData.isBlocked) {
      console.log('Permission Denied')
    } else {
      recorder
        .start()
        .then(() => {
          const audioStatus = {
            isRecording: true,
            blobURL: '',
            isBlocked: false,
          }
          setIsRecording(true)
          setAudioStatusData(audioStatus)
        })
        .catch((e) => console.error(e))
    }
  }

  function stopRec() {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)

        const audioStatus = {
          isRecording: false,
          blobURL,
          isBlocked: false,
        }

        const fileName = new Date().toISOString() + '.mp3'

        setIsRecording(false)
        setAudioStatusData(audioStatus)
        setAudioFile({
          blob,
          blobURL,
          type: blob.type,
          fileName,
        })
      })
      .catch((e) => console.log(e))
  }

  function resetAudioFile() {
    setAudioFile({} as AudioFileData)
  }

  return (
    <AudioRecContext.Provider
      value={{
        isRecording,
        audioFile,
        startRec,
        stopRec,
        resetAudioFile,
      }}
    >
      {children}
    </AudioRecContext.Provider>
  )
}
