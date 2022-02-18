import {
    Avatar,
    Box,
    Flex,
    Heading,
    IconButton,
    Image,
    Text,
    useDisclosure,
    useForceUpdate,
    Wrap
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArrowLeft, Chat, Heart, Share } from 'phosphor-react'
import React, { memo } from 'react'
import { useLikePost } from '../../../hooks/useLikePost'
import { PostType } from '../../../types'
import Comment from './Comment'
import { ReplyModal, ReplyThingy } from './ReplyModal'
interface Props {
    post: PostType
}

export const Actions: React.FC<{ width: string; item: PostType }> = memo(({ width, item }) => {
    const { handleLike, isLiked, likes, user } = useLikePost(item)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const forceUpdate = useForceUpdate()
    return (
        <>
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
                        onClick={onOpen}
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
            <ReplyModal forceUpdate={forceUpdate} post={item} isOpen={isOpen} onClose={onClose} user={user} />
        </>
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
                    <Avatar
                        onClick={e => {
                            e.stopPropagation()
                            router.push(`/profile/${post.owner.username}`)
                        }}
                        name={post.owner.username}
                        src={post.owner.avatar}
                    />
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
    forceUpdate: any
}
export const PostInfo: React.FC<PostInfoProps> = ({ post, forceUpdate }) => {
    const { handleLike, isLiked, likes, user } = useLikePost(post)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const router = useRouter()
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
                <Flex direction="column" gap={2}>
                    <Wrap>
                        <Avatar
                            onClick={e => {
                                e.stopPropagation()
                                router.push(`/profile/${post.owner.username}`)
                            }}
                            name={post.owner.username}
                            src={post.owner.avatar}
                        />
                        <Flex className="user" alignItems="center" gap={2}>
                            <Text fontWeight="500" fontSize="lg">
                                {post.owner.displayName}
                            </Text>
                            <Text color="gray.300" fontSize="sm">
                                @{post.owner.username}
                            </Text>
                        </Flex>
                    </Wrap>
                    <Flex direction="column" width="100%">
                        <Wrap pb={3} borderBottom="1px" borderColor="gray.200">
                            <Flex direction="column" fontSize="1.3rem" className="content">
                                <Text>{post.content}</Text>
                                {post.attachment && (
                                    <Box boxSize="80%">
                                        <Image borderRadius={16} src={post.attachment} alt="well" />
                                    </Box>
                                )}
                            </Flex>
                        </Wrap>
                        <Flex mt={4} gap={7}>
                            <Flex alignItems="center" gap={2}>
                                <Text>{likes}</Text>
                                <Text fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                                    Likes
                                </Text>
                            </Flex>
                            <Flex alignItems="center" gap={2}>
                                <Text>{post.comments.length}</Text>
                                <Text fontWeight="semibold" _hover={{ textDecoration: 'underline' }}>
                                    Replies / Comments
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
            <Flex
                borderBottom="1px"
                borderColor="gray.200"
                onClick={e => e.stopPropagation()}
                width="100%"
                justifyContent="space-between"
                alignItems="center"
                gap={4}
                p={3}
            >
                <IconButton
                    aria-label="Like"
                    backgroundColor="transparent"
                    icon={isLiked ? <Heart weight="fill" color="rgba(255, 19, 97, 1)" /> : <Heart />}
                    borderRadius="50%"
                    _focus={{ boxShadow: 'none' }}
                    _hover={{ backgroundColor: 'rgba(255, 19, 97, 0.37)' }}
                    onClick={handleLike}
                />
                <IconButton
                    aria-label="Reply"
                    backgroundColor="transparent"
                    icon={<Chat />}
                    borderRadius="50%"
                    onClick={onOpen}
                    _focus={{ boxShadow: 'none' }}
                    _hover={{ backgroundColor: 'rgba(35, 19, 255, 0.37)' }}
                />
                <IconButton
                    aria-label="Share"
                    backgroundColor="transparent"
                    icon={<Share />}
                    borderRadius="50%"
                    _focus={{ boxShadow: 'none' }}
                    _hover={{ backgroundColor: 'rgba(35, 19, 255, 0.37)' }}
                />
            </Flex>
            <ReplyThingy forceUpdate={forceUpdate} post={post} user={user} />
            <Box className="comments">
                {Boolean(post.comments.length) &&
                    post.comments.map((comment, i) => <Comment key={i} comment={comment} />)}
            </Box>
            <ReplyModal forceUpdate={forceUpdate} post={post} isOpen={isOpen} onClose={onClose} user={user} />
        </>
    )
}
Post.displayName = Post.name
export default Post
