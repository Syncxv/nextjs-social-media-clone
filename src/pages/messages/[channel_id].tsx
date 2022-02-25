import { Avatar, Box, Flex, IconButton, Input, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ImageSquare, PaperPlaneRight } from 'phosphor-react'
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
                    <Flex px={2} py={3} as="header">
                        <Flex width="100%" alignItems="center" gap={2}>
                            <Avatar
                                size="xs"
                                name={channel.members[0].username}
                                src={channel.members[0].avatar}
                            />
                            <Flex fontSize="0.9rem" direction="column" width="100%">
                                <Text fontWeight="500" fontSize="lg">
                                    {channel.members[0].displayName}
                                </Text>
                                <Text color="gray.300" fontSize="sm">
                                    @{channel.members[0].username}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex
                        overflowY="auto"
                        maxHeight="100vh"
                        minHeight="85vh"
                        px={4}
                        mb={5}
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        flexGrow="1"
                    >
                        {messages.map((msg, i) => (
                            <Message key={i} message={msg} />
                        ))}
                    </Flex>
                    <Flex px={1} alignItems="center">
                        <IconButton
                            aria-label="Like"
                            backgroundColor="transparent"
                            icon={<ImageSquare size={20} />}
                            borderRadius="50%"
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(19, 35, 255, 0.37)' }}
                            onClick={() => console.log('Well')}
                        />
                        <Input
                            placeholder="Send A Message"
                            mx={2}
                            size="sm"
                            borderRadius="999px"
                            width="100%"
                        />
                        <IconButton
                            aria-label="Like"
                            backgroundColor="transparent"
                            icon={<PaperPlaneRight size={22} />}
                            borderRadius="50%"
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(19, 35, 255, 0.37)' }}
                            onClick={() => console.log('Well')}
                        />
                    </Flex>
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
