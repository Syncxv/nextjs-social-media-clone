import { Avatar, Box, Center, Flex, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import React from 'react'
import client from '../../apollo/client'
import { GET_CHANNELS_QUERY } from '../../apollo/queries/channel'
import Layout from '../../components/Layout'
import { ChannelType } from '../../types'
import { _socketStore } from '../../stores/socket'
import { userStore } from '../../stores/user'
import withAuth from '../../components/withAtuh'
import { useRouter } from 'next/router'
interface Props {
    channels: ChannelType[]
}

const Channel: React.FC<{ channel: ChannelType }> = ({ channel }) => {
    const router = useRouter()
    return (
        <>
            <Flex
                width="100%"
                alignItems="center"
                borderBottom="1px"
                borderColor="gray.200"
                transition="all 200ms ease"
                gap={2}
                px={5}
                py={7}
                onClick={() => router.push(`/messages/${channel._id}`)}
                _hover={{
                    cursor: 'pointer',
                    backgroundColor: '#EBEFFD'
                }}
            >
                <Avatar name={channel.members[0].username} src={channel.members[0].avatar} />
                <Flex direction="column" width="100%">
                    <Flex className="user" alignItems="center" gap={2}>
                        <Text fontWeight="500" fontSize="lg">
                            {channel.members[0].displayName}
                        </Text>
                        <Text color="gray.300" fontSize="sm">
                            @{channel.members[0].username}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
export const MessagesLayout: React.FC<{ channels: ChannelType[] }> = ({ channels, children }) => {
    const router = useRouter()
    const isChannelSelected = router.query.channel_id
    return (
        <Layout>
            <Flex minHeight="100vh" as="main">
                <Box border="1px" borderColor="gray.200" as="section" width="75%">
                    {channels.map((chan, i) => (
                        <Channel key={i} channel={chan} />
                    ))}
                </Box>
                <Center borderRight="1px" borderColor="gray.200" as="section" width="100%">
                    {isChannelSelected ? children : <Text>bru select a message</Text>}
                </Center>
            </Flex>
        </Layout>
    )
}
const Messages: React.FC<Props> = ({ channels }) => {
    return <MessagesLayout channels={channels} />
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
