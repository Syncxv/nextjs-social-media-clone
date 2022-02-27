import { Avatar, Box, Center, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import React from 'react'
import client from '../../apollo/client'
import { GET_CHANNELS_QUERY } from '../../apollo/queries/channel'
import Layout from '../../components/Layout'
import { ChannelType, UserType } from '../../types'
import { _socketStore } from '../../stores/socket'
import { userStore } from '../../stores/user'
import withAuth from '../../components/withAtuh'
import { useRouter } from 'next/router'
import { Envelope, EnvelopeOpen } from 'phosphor-react'
interface Props {
    channels: ChannelType[]
}

export const Channel: React.FC<{ channel: ChannelType; user: UserType }> = ({ channel, user }) => {
    const router = useRouter()
    const selected = router.query.channel_id === channel._id
    const recivingMember = channel.members.find(s => s._id !== user._id)!
    return (
        <>
            <Box width="100%" borderBottom="1px" borderColor="gray.200">
                <Flex
                    width="100%"
                    alignItems="center"
                    transition="all 200ms ease"
                    borderRight={selected ? '5px solid' : '0px'}
                    borderColor="blue.600"
                    gap={2}
                    px={5}
                    py={7}
                    onClick={() => router.push(`/messages/${channel._id}`)}
                    _hover={{
                        cursor: 'pointer',
                        backgroundColor: '#EBEFFD'
                    }}
                >
                    <Avatar name={recivingMember.username} src={recivingMember.avatar} />
                    <Flex direction="column" width="100%">
                        <Flex className="user" alignItems="center" gap={2}>
                            <Text fontWeight="500" fontSize="lg">
                                {recivingMember.displayName}
                            </Text>
                            <Text color="gray.300" fontSize="sm">
                                @{recivingMember.username}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}
export const MessagesLayoutDefault: React.FC<{ channels: ChannelType[] }> = ({ channels }) => {
    const user = userStore(state => state.user)!
    return (
        <Layout>
            <Flex overflowX="hidden" minHeight="100vh" as="main">
                <Box border="1px" borderColor="gray.200" as="section" width="75%">
                    <Flex
                        px={5}
                        as="header"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom="1px"
                        borderColor="gray.200"
                    >
                        <Heading fontSize="xl">Messages</Heading>
                        <IconButton
                            aria-label="Like"
                            backgroundColor="transparent"
                            icon={<EnvelopeOpen size={20} />}
                            borderRadius="50%"
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(19, 35, 255, 0.37)' }}
                            onClick={() => console.log('Well')}
                        />
                    </Flex>
                    {channels.map((chan, i) => (
                        <Channel key={i} channel={chan} user={user} />
                    ))}
                </Box>
                <Box borderRight="1px" borderColor="gray.200" as="section" width="100%">
                    <Center>
                        <Text>bru select a message</Text>
                    </Center>
                </Box>
            </Flex>
        </Layout>
    )
}

const Messages: React.FC<Props> = ({ channels }) => {
    return <MessagesLayoutDefault channels={channels} />
}
export const getServerSideProps: GetServerSideProps = async context => {
    const {
        data: { getChannels }
    } = await client.query<{ getChannels: ChannelType[] }>({
        query: GET_CHANNELS_QUERY,
        context: { headers: { Authorization: `HEHHEHA ${context.req.cookies.token}` } }
    })
    return {
        props: { channels: getChannels }
    }
}
export default withAuth(Messages)
