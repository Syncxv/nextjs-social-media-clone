import { Box } from '@chakra-ui/react'
import React, { createRef, useEffect, useRef } from 'react'
import { CommentType, PostType } from '../../../../types'
import Comment from '.'
import client from '../../../../apollo/client'
import { GET_COMMENTS_AFTER } from '../../../../apollo/queries/comment'
import { _postStore } from '../../../../stores/post'
import useInView from '../../../../hooks/useInView'
// class CommentList extends React.Component<{ post: PostType }> {
//     ref: React.RefObject<HTMLDivElement>
//     intersectionObserver: IntersectionObserver
//     constructor(props: any) {
//         super(props)
//         this.ref = createRef()
//         this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
//             threshold: 0
//         })

//     }

//     componentDidMount() {
//         console.log('MOUNTED', this.ref)
//         if (this.ref.current) {
//             this.intersectionObserver.observe(this.ref.current)
//         }
//     }

//     render() {
//         return (
//             <>
//                 <Box className="comments">
//                     {Boolean(this.realPost.comments.length) &&
//                         this.realPost.comments.map((comment, i) => <Comment key={i} comment={comment} />)}
//                 </Box>
//                 <div style={{ height: '1px' }} ref={this.ref}></div>
//             </>
//         )
//     }

//     async handleIntersection([e]: IntersectionObserverEntry[]) {
//         const { post } = this.props
//         console.log(e.isIntersecting, this.props.post)
//         const hasMore = post.comments.length < post.commentCount
//         if (hasMore && e.isIntersecting) {
//             const {
//                 data: { getCommentsAfter: comments }
//             } = await client.query<{ getCommentsAfter: CommentType[] }>({
//                 query: GET_COMMENTS_AFTER,
//                 variables: { after: post.comments.at(-1)?._id, postId: post._id }
//             })
//         }
//     }
// }
export const CommentListBetter: React.FC<{ post: PostType }> = ({ post }) => {
    const postStore = _postStore(state => state)
    const ref = useRef<HTMLDivElement | null>(null)
    const isVisible = useInView({}, ref)
    useEffect(() => {
        const handleIntesection = async () => {
            console.log(isVisible, post)
            const hasMore = post.comments.length < post.commentCount
            if (hasMore && isVisible) {
                const {
                    data: { getCommentsAfter: comments }
                } = await client.query<{ getCommentsAfter: CommentType[] }>({
                    query: GET_COMMENTS_AFTER,
                    variables: { after: post.comments.at(-1)?._id, postId: post._id }
                })
                const updated = { ...post, comments: post.comments.concat(comments) }
                postStore.updatePost(updated)
                console.log(postStore)
            }
        }
        handleIntesection()
    }, [isVisible])
    return (
        <>
            <Box className="comments">
                {Boolean((postStore.getPost(post._id) || post).comments.length) &&
                    (postStore.getPost(post._id) || post).comments.map((comment, i) => (
                        <Comment key={i} comment={comment} />
                    ))}
            </Box>
            <div style={{ height: '1px' }} ref={ref}></div>
        </>
    )
}
export default CommentListBetter
