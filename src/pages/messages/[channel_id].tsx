import { useMutation } from '@apollo/client'
import { Avatar, Box, Flex, IconButton, Input, Text } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ImageSquare, PaperPlaneRight } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import { MessagesLayout } from '.'
import client from '../../apollo/client'
import { CREATE_MESSAGE_MUTATION } from '../../apollo/mutations/message'
import { GET_CHANNELS_QUERY } from '../../apollo/queries/channel'
import { GET_MESSAGES_QUERY } from '../../apollo/queries/messages'
import { Message } from '../../objects/Message'
import { _messageStore } from '../../stores/messages'
import { userStore } from '../../stores/user'
import { ChannelType, MessageType, MESSAGE_STATES } from '../../types'

interface Props {
    channels: ChannelType[]
    messages: MessageType[]
}
const MessageComponent: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <>
            <Box
                px={3}
                py={2}
                borderRadius="16px"
                borderBottomRightRadius="0px"
                backgroundColor={message.state === MESSAGE_STATES.SENDING ? 'gray.300' : 'blue.500'}
            >
                <Text color="white">{message.content}</Text>
            </Box>
        </>
    )
}
const ChannelTHingy: React.FC<Props> = ({ channels, messages: _messages }) => {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const messageStore = _messageStore(state => state)
    const user = userStore(state => state.user)!
    const [sendMessage] = useMutation<{ createMessage: MessageType }>(CREATE_MESSAGE_MUTATION)
    const channel = channels.find(s => s._id === router.query.channel_id)
    useEffect(() => {
        messageStore.initalize(
            channel!,
            _messages.map(s => new Message(s, MESSAGE_STATES.SENT))
        )
    }, [])
    if (!channel) return <MessagesLayout channels={channels}>unkown channel eh</MessagesLayout>
    console.log('BRUH bro', messageStore)
    console.log(messageStore?.channels[channel._id]?.messages)
    const messages = messageStore?.channels[channel._id]?.messages
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
                        direction="column"
                        gap={2}
                    >
                        {messages &&
                            Object.values(messages).map((msg, i) => (
                                <MessageComponent key={i} message={msg} />
                            ))}
                    </Flex>
                    <form
                        onSubmit={async e => {
                            e.preventDefault()
                            if (!inputRef.current?.value.length) return
                            const heheMessage = Message.new(user, channel, inputRef.current!.value)
                            messageStore.addMessage(channel._id, heheMessage)
                            try {
                                const { data } = await sendMessage({
                                    variables: { channelId: channel._id, content: inputRef.current?.value }
                                })
                                await new Promise(res => setTimeout(() => res(true), 2000))
                                const message = data!.createMessage
                                heheMessage.updateSelf(
                                    Message.new(
                                        message.author,
                                        message.channel,
                                        message.content,
                                        MESSAGE_STATES.SENT
                                    )
                                )
                                console.log(data?.createMessage, 'BRUH')
                            } catch {
                                heheMessage.state = MESSAGE_STATES.ERROR
                                heheMessage.updateSelf(heheMessage)
                            }
                        }}
                    >
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
                                ref={inputRef}
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
                                type="submit"
                            />
                        </Flex>
                    </form>
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
