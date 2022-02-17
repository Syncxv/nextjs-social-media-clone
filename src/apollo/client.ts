import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql'
})
const uploadLink = createUploadLink({
    uri: 'http://localhost:8000/graphql'
    // fetchOptions: { credentials: 'include' }
})
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    let token
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token')
    }
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            Authorization: token ? `HEHEHA ${token}` : ''
        }
    }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
    try {
        if (graphQLErrors)
            graphQLErrors.forEach(({ message, locations, path }) =>
                console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
            )

        if (networkError) console.log(`[Network error]: ${networkError}`)
    } catch (e) {
        console.error(e)
    }
})

const client = new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, uploadLink, httpLink]),
    cache: new InMemoryCache()
})

export default client
