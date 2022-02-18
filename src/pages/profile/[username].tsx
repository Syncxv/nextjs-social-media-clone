import { useQuery } from '@apollo/client'
import { Avatar, Box, Button, Flex, Heading, Text, Wrap } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Pencil, PencilSimple } from 'phosphor-react'
import React from 'react'
import styled from 'styled-components'
import { GET_USER_BY_USERNAME_QUERY } from '../../apollo/queries/user'
import Layout from '../../components/Layout'
import { UserType } from '../../types'

interface Props {}
const ProfileAvatar = styled(Avatar)`
    --opacity: 0;
    transition: all 200ms ease;
    &:hover {
        --opacity: 1;
        filter: brightness(70%);
    }
`
const ProfilePage: NextPage<Props> = ({}) => {
    const router = useRouter()
    const { loading, data, error } = useQuery<{ findUser: UserType }>(GET_USER_BY_USERNAME_QUERY, {
        variables: { username: router.query.username }
    })
    console.log(data)
    if (loading) return <div>Loading</div>
    if (!data?.findUser || error) return <div>Not found eh</div>
    const { findUser: user } = data
    return (
        <Layout>
            <Box height="20rem" width="100%">
                <Box height="50%" backgroundColor="#ff5e5e"></Box>
                <Flex pl={5} direction="column" className="user-stuff">
                    <ProfileAvatar
                        transform="translateY(-50%)"
                        size="xl"
                        name={user.username}
                        src={user.avatar}
                        position="absolute"
                        _hover={{ filter: 'brightness(70%)' }}
                        onClick={() => router.push('/settings/profile')}
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
                        <Button colorScheme="blue" _focus={{ boxShadow: 'none' }}>
                            Follow
                        </Button>
                    </Flex>
                    <Box>
                        <Heading fontSize="xl">{user.displayName}</Heading>
                        <Text mb={4} fontSize="md" color="gray.500">
                            @{user.username}
                        </Text>
                        <Text>{user.followers.length} Followers</Text>
                    </Box>
                </Flex>
            </Box>
        </Layout>
    )
}

export default ProfilePage