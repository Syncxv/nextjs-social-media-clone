import { Avatar, Box, Flex, Image, Text, Wrap } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { PostType } from '../../../types'
interface Props {
    post: PostType
}
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
                    <Flex direction="column">
                        <Flex className="user" alignItems="center" gap={2}>
                            <Text fontSize="lg">{post.owner.displayName}</Text>
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
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default Post
