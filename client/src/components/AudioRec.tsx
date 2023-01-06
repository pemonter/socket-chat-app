import { useContext } from 'react'

import { Microphone, StopCircle } from 'phosphor-react'

import { AudioRecContext } from '@contexts/AudioRecContext'

export function AudioRec() {
  const { isRecording, audioFile, startRec, stopRec } =
    useContext(AudioRecContext)

  if (audioFile.blobURL) {
    return (
      <audio src={audioFile.blobURL} controls={true} className="flex flex-1" />
    )
  }

  return (
    <>
      {!isRecording ? (
        <button onClick={startRec}>
          <Microphone size={24} />
        </button>
      ) : (
        <button onClick={stopRec}>
          <StopCircle size={24} />
        </button>
      )}
    </>
  )
}
