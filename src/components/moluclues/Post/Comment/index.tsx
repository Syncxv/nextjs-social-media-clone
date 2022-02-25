import { useApolloClient } from '@apollo/client'
import { Box, Flex, Avatar, Wrap, Text, Image, IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Heart, Share } from 'phosphor-react'
import { useState } from 'react'
import { COMMENT_LIKE_MUTATION } from '../../../../apollo/queries/comment'
import { userStore } from '../../../../stores/user'
import { CommentType } from '../../../../types'

const CommentAction: React.FC<{ width: string; comment: CommentType }> = ({ width, comment }) => {
    const client = useApolloClient()
    const user = userStore(state => state.user)
    const [isLiked, setLiked] = useState(user ? comment.likedUsers.includes(user._id) : false)
    const [likes, setLikes] = useState(comment.likes)
    const handleLike = async () => {
        const { data } = await client.mutate<{ likeComment: { comment: CommentType } }>({
            mutation: COMMENT_LIKE_MUTATION,
            variables: { commentId: comment._id }
        })
        const resIsLiked = data!.likeComment.comment.likedUsers.includes(user!._id)
        console.log(resIsLiked)
        setLiked(resIsLiked)
        setLikes(prev => (resIsLiked ? prev + 1 : prev - 1))
    }
    return (
        <Flex
            onClick={e => e.stopPropagation()}
            padding="0 .5rem"
            width={width}
            justifyContent="space-between"
            alignItems="center"
            gap={4}
        >
            <Flex alignItems="center" gap={1}>
                <IconButton
                    aria-label="Like"
                    backgroundColor="transparent"
                    icon={isLiked ? <Heart weight="fill" color="rgba(255, 19, 97, 1)" /> : <Heart />}
                    borderRadius="50%"
                    _focus={{ boxShadow: 'none' }}
                    _hover={{ backgroundColor: 'rgba(255, 19, 97, 0.37)' }}
                    onClick={handleLike}
                />
                <Text>{likes}</Text>
            </Flex>
            <IconButton
                aria-label="Share"
                backgroundColor="transparent"
                icon={<Share />}
                borderRadius="50%"
                _focus={{ boxShadow: 'none' }}
                _hover={{ backgroundColor: 'rgba(35, 19, 255, 0.37)' }}
            />
        </Flex>
    )
}
interface Props {
    comment: CommentType
}

const Comment: React.FC<Props> = ({ comment }) => {
    const router = useRouter()
    return (
        <>
            <Box
                _hover={{
                    backgroundColor: '#EBEFFD'
                }}
                transition="500ms ease"
                padding={4}
                borderBottom="1px"
                borderColor="gray.200"
                cursor="pointer"
            >
                <Flex gap={2}>
                    <Avatar
                        onClick={e => {
                            e.stopPropagation()
                            router.push(`/profile/${comment.author.username}`)
                        }}
                        name={comment.author.username}
                        src={comment.author.avatar}
                    />
                    <Flex direction="column" width="100%">
                        <Flex className="user" alignItems="center" gap={2}>
                            <Text fontWeight="500" fontSize="lg">
                                {comment.author.displayName}
                            </Text>
                            <Text color="gray.300" fontSize="sm">
                                @{comment.author.username}
                            </Text>
                        </Flex>
                        <Wrap className="content">
                            <Text>{comment.content}</Text>
                        </Wrap>
                        {comment.attachment && (
                            <Box boxSize="80%">
                                <Image borderRadius={16} src={comment.attachment} alt="well" />
                            </Box>
                        )}
                        <CommentAction comment={comment} width="80%" />
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default Comment
