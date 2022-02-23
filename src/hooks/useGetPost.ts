import { ApolloClient, useApolloClient } from '@apollo/client'
import { useState, useEffect } from 'react'
import { GET_POSTS_QUERY, GET_POST_QUERY } from '../apollo/queries/posts'
import { _postStore } from '../stores/post'
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
    const postStore = _postStore()
    useEffect(() => {
        const post = postStore.getPost(id)
        if (post) return setData(post)
        client
            .query<{ getPost: PostType; fetchPolicy: 'network-only' }>({
                query: GET_POST_QUERY,
                variables: { post_id: id }
            })
            .then(({ data }) => {
                setLoading(false)
                setData(data.getPost)
                postStore.updatePost(data.getPost)
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
