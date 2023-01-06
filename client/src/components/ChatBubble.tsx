import { useContext } from 'react'

import { UserContext } from '@contexts/UserContext'

import { File } from './File'

import saveAs from 'file-saver'

import classNames from 'classnames'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { IMessage } from '../@types/message'

interface ChatBubbleProps extends IMessage {
  blob?: Blob
  fileType?: string
}

export function ChatBubble({
  authorId,
  authorName,
  body,
  sendAt,
  blob,
  fileName,
  fileType,
}: ChatBubbleProps) {
  const { userId } = useContext(UserContext)
  const isSelf = authorId === userId

  const messageSendAt = format(new Date(sendAt), "dd 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  })

  function downloadFile(fileURL: string, fileName: string) {
    saveAs(fileURL, fileName)
  }

  return (
    <div
      className={classNames('m-2 flex', {
        'pl-10 justify-end': isSelf,
        'pr-10 justify-start': !isSelf,
      })}
    >
      <div className="flex flex-col">
        <div
          className={classNames('inline-block py-2 px-4 rounded', {
            'bg-green-600': isSelf,
            'bg-gray-500': !isSelf,
          })}
        >
          {typeof body === 'string' ? (
            <p
              className={classNames('text-sm justify-center', {
                'text-right': isSelf,
                'text-left': !isSelf,
              })}
            >
              {body}
            </p>
          ) : (
            <File
              blob={blob}
              fileName={fileName}
              fileType={fileType}
              onDownloadFile={downloadFile}
            />
          )}
          <div
            className={classNames('text-xs opacity-75', {
              'text-right': isSelf,
              'text-left': !isSelf,
            })}
          >
            {messageSendAt}
          </div>
        </div>
        <p
          className={classNames('text-xs', {
            'text-right': isSelf,
            'text-left': !isSelf,
          })}
        >
          {isSelf ? 'You' : authorName}
        </p>
      </div>
    </div>
  )
}
