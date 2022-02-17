import { useApolloClient } from '@apollo/client'
import { Avatar, Box, Flex, Heading, IconButton, Image, Text, Wrap } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArrowLeft, Chat, Heart, Share } from 'phosphor-react'
import React, { memo, useState } from 'react'
import { POST_LIKE_MUTATION } from '../../../apollo/queries/posts'
import { userStore } from '../../../stores/user'
import { PostType } from '../../../types'
import Comment from './Comment'
interface Props {
    post: PostType
}
export const Actions: React.FC<{ width: string; item: PostType }> = memo(({ width, item }) => {
    const client = useApolloClient()
    const user = userStore(state => state.user)
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
            <Flex alignItems="center" gap={1}>
                <IconButton
                    aria-label="Reply"
                    backgroundColor="transparent"
                    icon={<Chat />}
                    borderRadius="50%"
                    _focus={{ boxShadow: 'none' }}
                    _hover={{ backgroundColor: 'rgba(35, 19, 255, 0.37)' }}
                />
                <Text>{(item as PostType).comments.length}</Text>
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
})
Actions.displayName = Actions.name
const Post: React.FC<Props> = ({ post }) => {
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
                onClick={() => router.push(`/post/${post._id}`)}
            >
                <Flex gap={2}>
                    <Avatar name={post.owner.username} src={post.owner.avatar} />
                    <Flex direction="column" width="100%">
                        <Flex className="user" alignItems="center" gap={2}>
                            <Text fontWeight="500" fontSize="lg">
                                {post.owner.displayName}
                            </Text>
                            <Text color="gray.300" fontSize="sm">
                                @{post.owner.username}
                            </Text>
                        </Flex>
                        <Wrap className="content">
                            <Text>{post.content}</Text>
                        </Wrap>
                        {post.attachment && (
                            <Box boxSize="80%">
                                <Image borderRadius={16} src={post.attachment} alt="well" />
                            </Box>
                        )}
                        <Actions item={post} width="80%" />
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export const PostHeader: React.FC<{ label: string; hideIcon?: boolean }> = ({ label, hideIcon }) => {
    const router = useRouter()
    return (
        <Flex
            gap={5}
            mb={4}
            p={4}
            backgroundColor="rgba(255, 255, 255, 0.85)" // ILL ADD THEMES LATER BRO
            backdropFilter="blur(12px)"
            position="sticky"
            top={0}
            zIndex={5}
        >
            <Wrap>
                {!hideIcon && (
                    <IconButton
                        aria-label="Back"
                        backgroundColor="transparent"
                        borderRadius="50%"
                        icon={<ArrowLeft size={24} />}
                        onClick={() => router.back()}
                        _focus={{ boxShadow: 'none' }}
                        _hover={{ backgroundColor: '#dadada58' }}
                    />
                )}
                <Heading size="lg">{label}</Heading>
            </Wrap>
        </Flex>
    )
}

interface PostInfoProps {
    post: PostType
}
export const PostInfo: React.FC<PostInfoProps> = ({ post }) => {
    return (
        <>
            <PostHeader label="Post" />
            <Box
                transition="500ms ease"
                padding={4}
                borderBottom="1px"
                borderColor="gray.200"
                cursor="pointer"
            >
                <Flex gap={2}>
                    <Avatar name={post.owner.username} src={post.owner.avatar} />
                    <Flex direction="column" width="100%">
                        <Flex className="user" alignItems="center" gap={2}>
                            <Text fontWeight="500" fontSize="lg">
                                {post.owner.displayName}
                            </Text>
                            <Text color="gray.300" fontSize="sm">
                                @{post.owner.username}
                            </Text>
                        </Flex>
                        <Wrap className="content">
                            <Text>{post.content}</Text>
                        </Wrap>
                        {post.attachment && (
                            <Box boxSize="80%">
                                <Image borderRadius={16} src={post.attachment} alt="well" />
                            </Box>
                        )}
                        <Actions item={post} width="80%" />
                    </Flex>
                </Flex>
            </Box>
            <Box className="comments">
                {Boolean(post.comments.length) &&
                    post.comments.map((comment, i) => <Comment key={i} comment={comment} />)}
            </Box>
        </>
    )
}
Post.displayName = Post.name
export default Post
