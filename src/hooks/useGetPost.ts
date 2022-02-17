import { ApolloClient, useApolloClient } from '@apollo/client'
import { useState, useEffect } from 'react'
import { GET_POSTS_QUERY, GET_POST_QUERY } from '../apollo/queries/posts'
import { PostType } from '../types'

interface getPostDataReturnType {
    data: PostType | null | undefined
    loading: boolean
    error: string | null
    client: ApolloClient<object>
}
interface GetPostsQueryResponseIdkMAN {
    getPosts: PostType[]
}
export const useGetPostData = (id: string, refresh: number): getPostDataReturnType => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<PostType | null | undefined>(null)
    const [error, setError] = useState<string | null>(null)
    const client = useApolloClient()
    useEffect(() => {
        const cachedData = client.readQuery<GetPostsQueryResponseIdkMAN>({ query: GET_POSTS_QUERY })
        if (cachedData) {
            setLoading(false)
            setData(cachedData.getPosts.find(s => s._id === id))
            console.log('SENT CAHCHED DATA')
            return
        }
        client
            .query<{ getPost: PostType; fetchPolicy: 'network-only' }>({
                query: GET_POST_QUERY,
                variables: { post_id: id }
            })
            .then(({ data }) => {
                setLoading(false)
                setData(data.getPost)
                console.log('SENT FETCHED DATA')
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                setError(err)
            })
            .finally(() => setLoading(false))
    }, [id, refresh])

    return { data, loading, error, client }
}
