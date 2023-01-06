import Head from 'next/head'
import { AppProps } from 'next/app'

import { AudioRecContextProvider } from '@contexts/AudioRecContext'
import { UserContextProvider } from '@contexts/UserContext'

import '@styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <AudioRecContextProvider>
        <Head>
          <title>NextJS TailwindCSS TypeScript Starter</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
      </AudioRecContextProvider>
    </UserContextProvider>
  )
}

export default MyApp
