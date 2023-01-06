import { useEffect, useState } from 'react'

interface FileProps {
  blob: Blob
  fileName: string
  fileType: string
  onDownloadFile: (fileURL: string, fileName: string) => void
}

export function File({ blob, fileName, fileType, onDownloadFile }: FileProps) {
  const [fileSrc, setFileSrc] = useState('')

  function handleDownloadFile() {
    const fileURL = URL.createObjectURL(blob)
    onDownloadFile(fileURL, fileName)
  }

  useEffect(() => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      setFileSrc(String(reader.result))
    }
  }, [blob])

  if (fileType === 'application') {
    return (
      <div onClick={handleDownloadFile} className="cursor-pointer">
        {fileName}
      </div>
    )
  }

  if (fileType === 'audio') {
    return (
      <div className="cursor-pointer">
        <audio src={fileSrc} controls={true} />
      </div>
    )
  }

  return (
    <img
      src={fileSrc}
      alt={fileName}
      onClick={handleDownloadFile}
      style={{ width: 150, height: 'auto' }}
      className="cursor-pointer"
    />
  )
}
