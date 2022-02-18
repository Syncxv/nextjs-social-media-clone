import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ADD_COMMENT_MUTATION } from '../apollo/mutations/comment'
import { PostType } from '../types'

export const useReply = (post: PostType, textareaRef: any) => {
    const [submitComment] = useMutation<{ addComment: PostType }>(ADD_COMMENT_MUTATION, {
        onCompleted: res => console.log(res)
    })
    const [image, setImage] = useState<File | null>(null)
    const reply = async () => {
        await submitComment({
            variables: { postid: post._id, addImage: image, addContent: textareaRef.current?.value }
        })
    }

    return { reply, image, setImage }
}
