import { useApolloClient, useMutation } from '@apollo/client'
import {
    Avatar,
    Box,
    Button,
    CloseButton,
    Flex,
    Heading,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
    Wrap
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArrowLeft, Chat, Heart, Share, Image as ImageIcon, Rectangle } from 'phosphor-react'
import React, { memo, useRef, useState } from 'react'
import { ADD_COMMENT_MUTATION } from '../../../apollo/mutations/comment'
import { POST_LIKE_MUTATION } from '../../../apollo/queries/posts'
import { useLikePost } from '../../../hooks/useLikePost'
import { userStore } from '../../../stores/user'
import { PostType, UserType } from '../../../types'
import Comment from './Comment'
interface Props {
    post: PostType
}
const ReplyModal: React.FC<{ isOpen: boolean; onClose: any; user: UserType; post: PostType }> = ({
    isOpen,
    onClose,
    user,
    post
}) => {
    const [submitComment] = useMutation<{ addComment: PostType }>(ADD_COMMENT_MUTATION, {
        onCompleted: res => console.log(res)
    })
    const [image, setImage] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const reply = () => {
        console.log(textareaRef.current?.value)
        submitComment({
            variables: { postid: post._id, addImage: image, addContent: textareaRef.current?.value }
        })
    }
    return (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton left={3} _focus={{ boxShadow: 'none' }} />
                <ModalBody mt={10}>
                    <Flex gap={2}>
                        <Avatar name={user.username} src={user.avatar} />

                        <Flex direction="column">
                            <Textarea
                                ref={textareaRef}
                                placeholder="Reply ong on me"
                                size="sm"
                                resize="none"
                                border="none"
                                _focus={{ boxShadow: 'none' }}
                            />
                            <Wrap position="relative">
                                {image !== null && (
                                    <>
                                        <CloseButton
                                            position="absolute"
                                            top={3}
                                            left={3}
                                            backgroundColor="#ffffffa9"
                                            borderRadius="50%"
                                            onClick={() => setImage(null)}
                                            _focus={{ boxShadow: 'none' }}
                                            _hover={{
                                                backgroundColor: '#ffffffd5'
                                            }}
                                        />
                                        <Image
                                            borderRadius={16}
                                            src={URL.createObjectURL(image)}
                                            alt="wel["
                                        />
                                    </>
                                )}
                            </Wrap>
                        </Flex>
                    </Flex>
                </ModalBody>

                <ModalFooter justifyContent="space-between">
                    <Wrap marginLeft="3.5rem">
                        <IconButton
                            aria-label="Select Image"
                            backgroundColor="transparent"
                            icon={<ImageIcon />}
                            borderRadius="50%"
                            onClick={() => fileInputRef.current?.click()}
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.37)' }}
                        />
                        <input
                            onChange={e => setImage(e.target.files?.length ? e.target.files[0] : null)}
                            type="file"
                            accept="image/png, image/jpeg"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <IconButton
                            aria-label="Select Image"
                            backgroundColor="transparent"
                            icon={<Rectangle />}
                            borderRadius="50%"
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.37)' }}
                        />
                    </Wrap>
                    <Button
                        color="white"
                        backgroundColor="rgba(88, 77, 255, 1)"
                        borderRadius={30}
                        onClick={reply}
                        _focus={{ boxShadow: 'none' }}
                        _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.9)' }}
                    >
                        Reply
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
export const Actions: React.FC<{ width: string; item: PostType }> = memo(({ width, item }) => {
    const { handleLike, isLiked, likes, user } = useLikePost(item)
    const { isOpen, onOpen, onClose } = useDisclosure()
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
            <ReplyModal post={item} isOpen={isOpen} onClose={onClose} user={user} />
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
    const { handleLike, isLiked, likes, user } = useLikePost(post)
    const { isOpen, onOpen, onClose } = useDisclosure()
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
                        <Avatar name={post.owner.username} src={post.owner.avatar} />
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
                        <Wrap borderBottom="1px" borderColor="gray.200">
                            <Wrap ml={2} fontSize="1.3rem" className="content">
                                <Text>{post.content}</Text>
                            </Wrap>
                            {post.attachment && (
                                <Box boxSize="80%">
                                    <Image borderRadius={16} src={post.attachment} alt="well" />
                                </Box>
                            )}
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
                    <Flex
                        onClick={e => e.stopPropagation()}
                        padding="0 .5rem"
                        width="100%"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={4}
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
                    <ReplyModal post={post} isOpen={isOpen} onClose={onClose} user={user} />
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
