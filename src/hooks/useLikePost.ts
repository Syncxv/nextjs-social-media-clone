import { useApolloClient } from '@apollo/client'
import { useState } from 'react'
import { POST_LIKE_MUTATION } from '../apollo/queries/posts'
import { userStore } from '../stores/user'
import { PostType } from '../types'

export const useLikePost = (item: PostType) => {
    const client = useApolloClient()
    const user = userStore(state => state.user)!
    const [isLiked, setLiked] = useState(user ? item.likedUsers.includes(user!._id) : false)
    const [likes, setLikes] = useState(item.likedUsers.length)
    const handleLike = async () => {
        const { data } = await client.mutate<{ likePost: { post: PostType } }>({
            mutation: POST_LIKE_MUTATION,
            variables: { likePostPostId2: item._id }
        })
        const resIsLiked = data!.likePost.post.likedUsers.includes(user!._id)
        console.log(resIsLiked)
        setLiked(resIsLiked)
        setLikes(prev => (resIsLiked ? prev + 1 : prev - 1))
    }
    return { isLiked, likes, handleLike, user }
}
