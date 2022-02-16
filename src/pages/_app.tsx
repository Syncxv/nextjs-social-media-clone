import '../styles/main.scss'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo/client'
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </ApolloProvider>
    )
}

export default MyApp
