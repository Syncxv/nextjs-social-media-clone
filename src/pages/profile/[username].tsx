import { useQuery } from '@apollo/client'
import { Avatar, Box, Button, Flex, Heading, Text, Tooltip, Wrap } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Pencil, PencilSimple } from 'phosphor-react'
import React from 'react'
import styled from 'styled-components'
import { GET_USER_BY_USERNAME_QUERY } from '../../apollo/queries/user'
import Layout from '../../components/Layout'
import { PostHeader } from '../../components/moluclues/Post'
import withAuth from '../../components/withAtuh'
import { useFollow } from '../../hooks/useFollow'
import { userStore } from '../../stores/user'
import { UserType } from '../../types'

interface Props {}
const ProfileAvatar = styled(Avatar)`
    --opacity: 0;
    transition: all 200ms ease;
`
const ProfilePage: NextPage<Props> = ({}) => {
    const router = useRouter()
    const { loading, data, error } = useQuery<{ findUser: UserType }>(GET_USER_BY_USERNAME_QUERY, {
        variables: { username: router.query.username }
    })
    const { unfollow, follow, followers, isFollowing } = useFollow(data?.findUser)
    const store = userStore()!
    if (loading) return <div>Loading</div>
    if (!data?.findUser || error) return <div>Not found eh</div>
    const { findUser: user } = data
    const isCurrentUser = user._id === store.user!._id
    return (
        <Layout>
            <PostHeader label={user.displayName} />
            <Box height="20rem" width="100%">
                <Box height="50%" backgroundColor="#ff5e5e"></Box>
                <Flex pl={5} direction="column" className="user-stuff">
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
        </Layout>
    )
}

export default withAuth(ProfilePage)
