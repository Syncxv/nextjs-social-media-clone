import { useQuery } from '@apollo/client'
import { Avatar, Box, Button, Center, Flex, Heading, Text, Tooltip, Wrap } from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Pencil, PencilSimple } from 'phosphor-react'
import React from 'react'
import styled from 'styled-components'
import client from '../../apollo/client'
import { GET_USER_POSTS } from '../../apollo/queries/posts'
import { GET_USER_BY_USERNAME_QUERY } from '../../apollo/queries/user'
import Layout from '../../components/Layout'
import Post, { PostHeader } from '../../components/moluclues/Post'
import withAuth from '../../components/withAtuh'
import { useFollow } from '../../hooks/useFollow'
import { userStore } from '../../stores/user'
import { PostType, UserType } from '../../types'

interface Props {
    user: UserType
    posts: PostType[]
}
const ProfileAvatar = styled(Avatar)`
    --opacity: 0;
    transition: all 200ms ease;
`
const ProfilePage: NextPage<Props> = ({ user, posts }) => {
    const router = useRouter()
    const { unfollow, follow, followers, isFollowing } = useFollow(user)
    const store = userStore()!
    if (!user) return <div>not found eh</div>
    const isCurrentUser = user._id === store.user!._id
    console.log(user, posts)
    return (
        <Layout>
            <PostHeader label={user.displayName} />
            <Box height="20rem" width="100%">
                <Box height="50%" backgroundColor="#ff5e5e"></Box>
                <Flex pl={5} direction="column" className="user-stuff">
                    <Box position="relative">
                        <ProfileAvatar
                            transform="translateY(-50%)"
                            size="xl"
                            name={user.username}
                            src={user.avatar}
                            position="absolute"
                            _hover={{
                                '--opacity': isCurrentUser ? 1 : 0,
                                filter: isCurrentUser ? 'brightness(70%)' : 'none'
                            }}
                            onClick={() => isCurrentUser && router.push('/settings/profile')}
                        >
                            <Flex
                                justifyContent="center"
                                alignItems="center"
                                position="absolute"
                                inset={0}
                                color="black"
                            >
                                <PencilSimple opacity="var(--opacity)" />
                            </Flex>
                        </ProfileAvatar>
                    </Box>
                    <Flex m={2} justifyContent="flex-end">
                        <Button
                            colorScheme="blue"
                            _focus={{ boxShadow: 'none' }}
                            onClick={() =>
                                isCurrentUser
                                    ? router.push('/settings/profile')
                                    : isFollowing
                                    ? unfollow()
                                    : follow()
                            }
                        >
                            {isCurrentUser ? 'Edit Profile' : isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                    </Flex>
                    <Box>
                        <Heading fontSize="xl">{user.displayName}</Heading>
                        <Text mb={4} fontSize="md" color="gray.500">
                            @{user.username}
                        </Text>
                        <Text>{followers} Followers</Text>
                    </Box>
                </Flex>
            </Box>
            <Center>
                <Heading fontSize="lg" mb={3}>
                    Posts
                </Heading>
            </Center>
            {posts.map((post, i) => (
                <Post key={i} post={post} />
            ))}
        </Layout>
    )
}
export const getServerSideProps: GetServerSideProps = async context => {
    const {
        data: { findUser }
    } = await client.query<{ findUser: UserType }>({
        query: GET_USER_BY_USERNAME_QUERY,
        variables: { username: context.query.username }
    })
    if (!findUser)
        return {
            props: { user: null }
        }
    const { data } = await client.query<{ getUserPosts: PostType[] }>({
        query: GET_USER_POSTS,
        variables: { userId: findUser._id }
    })
    return {
        props: { user: findUser, posts: data.getUserPosts }
    }
}
export default withAuth(ProfilePage)
