import { Box, Flex, List, ListItem, Text, Wrap, WrapItem } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { MessagesLayout } from '.'
import client from '../../apollo/client'
import { GET_CHANNELS_QUERY } from '../../apollo/queries/channel'
import { GET_MESSAGES_QUERY } from '../../apollo/queries/messages'
import { ChannelType, MessageType } from '../../types'

interface Props {
    channels: ChannelType[]
    messages: MessageType[]
}
const Message: React.FC<{ message: MessageType }> = ({ message }) => {
    return (
        <>
            <Box px={3} py={2} borderRadius="16px" borderBottomRightRadius="0px" backgroundColor="blue.500">
                <Text color="white">{message.content}</Text>
            </Box>
        </>
    )
}
const ChannelTHingy: React.FC<Props> = ({ channels, messages }) => {
    const router = useRouter()
    const channel = channels.find(s => s._id === router.query.channel_id)
    if (!channel) return <MessagesLayout channels={channels}>unkown channel eh</MessagesLayout>
    console.log(messages)
    return (
        <>
            <MessagesLayout channels={channels}>
                <Flex mt="auto" direction="column">
                    <Flex px={4} mb={5} justifyContent="flex-end" alignItems="flex-end" minHeight="85vh">
                        {messages.map((msg, i) => (
                            <Message key={i} message={msg} />
                        ))}
                    </Flex>
                    <Text>hi</Text>
                </Flex>
            </MessagesLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async context => {
    const {
        data: { getChannels }
    } = await client.query<{ getChannels: ChannelType[] }>({
        query: GET_CHANNELS_QUERY,
        context: { headers: { Authorization: `HEHHEHA ${context.req.cookies.token}` } }
    })
    const {
        data: { getMessages }
    } = await client.query<{ getMessages: MessageType[] }>({
        query: GET_MESSAGES_QUERY,
        variables: { channelId: context.query.channel_id },
        context: { headers: { Authorization: `HEHHEHA ${context.req.cookies.token}` } }
    })
    return {
        props: { channels: getChannels, messages: getMessages }
    }
}

export default ChannelTHingy
