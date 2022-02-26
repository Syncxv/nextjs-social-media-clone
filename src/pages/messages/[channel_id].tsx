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
import withAuth from '../../components/withAtuh'
import { Message } from '../../objects/Message'
import { _messageStore } from '../../stores/messages'
import { userStore } from '../../stores/user'
import { ChannelType, MessageType, MESSAGE_STATES, UserType } from '../../types'

interface Props {
    channels: ChannelType[]
    messages: MessageType[]
}
const MessageComponent: React.FC<{ message: Message; user: UserType }> = ({ message, user }) => {
    const isCurrentUser = user._id === message.author._id
    return (
        <>
            <Box
                px={3}
                py={2}
                borderRadius="16px"
                borderBottomRightRadius="0px"
                backgroundColor={
                    isCurrentUser
                        ? message.state === MESSAGE_STATES.SENDING
                            ? 'blue.300'
                            : 'blue.500'
                        : 'gray.300'
                }
                alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
            >
                <Text color={isCurrentUser ? 'white' : 'black'}>{message.content}</Text>
            </Box>
        </>
    )
}
const ChannelTHingy: React.FC<Props> = ({ channels, messages: _messages }) => {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const scrollableRef = useRef<HTMLDivElement | null>(null)
    const toScrollRef = useRef<HTMLDivElement | null>(null)
    const messageStore = _messageStore(state => state)
    const user = userStore(state => state.user)!
    const [sendMessage] = useMutation<{ createMessage: { message: MessageType } }>(CREATE_MESSAGE_MUTATION)
    const channel = channels.find(s => s._id === router.query.channel_id)
    useEffect(() => {
        messageStore.initalize(
            channel!,
            _messages.map(s => new Message(s, MESSAGE_STATES.SENT)),
            hehe
        )
        setTimeout(() => toScrollRef.current?.scrollIntoView(), 50)
    }, [])
    const hehe = () => {
        console.log(toScrollRef)
        setTimeout(() => toScrollRef.current?.scrollIntoView(), 50)
    }
    if (!channel) return <MessagesLayout channels={channels}>unkown channel eh</MessagesLayout>
    console.log('BRUH bro', messageStore)
    console.log(messageStore?.channels[channel._id]?.messages)
    const messages = messageStore?.channels[channel._id]?.messages
    const recivingMember = channel.members.find(s => s._id !== user._id)!
    return (
        <>
            <MessagesLayout channels={channels}>
                <Flex mt="auto" direction="column" height="100vh">
                    <Flex
                        backgroundColor="rgba(255, 255, 255, 0.85)" // ILL ADD THEMES LATER BRO
                        backdropFilter="blur(12px)"
                        border="1px"
                        borderColor="gray.200"
                        px={2}
                        py={3}
                        as="header"
                    >
                        <Flex width="100%" alignItems="center" gap={2}>
                            <Avatar size="xs" name={recivingMember.username} src={recivingMember.avatar} />
                            <Flex fontSize="0.9rem" direction="column" width="100%">
                                <Text fontWeight="500" fontSize="lg">
                                    {recivingMember.displayName}
                                </Text>
                                <Text color="gray.300" fontSize="sm">
                                    @{recivingMember.username}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex
                        ref={scrollableRef}
                        overflowY="auto"
                        maxHeight="85vh"
                        px={4}
                        mb={5}
                        alignItems="flex-end"
                        flexGrow="1"
                        direction="column"
                        gap={2}
                    >
                        {messages &&
                            messages.map((msg, i) => <MessageComponent key={i} message={msg} user={user} />)}
                        <div ref={toScrollRef}></div>
                    </Flex>
                    <form
                        onSubmit={async e => {
                            e.preventDefault()
                            if (!inputRef.current?.value.length) return
                            console.log('BEFORE', Object.values(messageStore.channels[channel._id].messages))
                            const heheMessage = Message.new(user, channel, inputRef.current!.value)
                            messageStore.addMessage(heheMessage)
                            try {
                                const { data } = await sendMessage({
                                    variables: { channelId: channel._id, content: inputRef.current?.value }
                                })
                                const message = data!.createMessage.message
                                heheMessage.updateSelf(
                                    Message.new(
                                        message.author,
                                        message.channel,
                                        message.content,
                                        MESSAGE_STATES.SENT
                                    )
                                )
                                toScrollRef.current?.scrollIntoView()
                                console.log(data?.createMessage, 'BRUH')
                            } catch {
                                heheMessage.state = MESSAGE_STATES.ERROR
                                heheMessage.updateSelf(heheMessage)
                                toScrollRef.current?.scrollIntoView()
                            }
                            console.log('AFTER', Object.values(messageStore.channels[channel._id].messages))
                            inputRef.current!.value = ''
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
        context: { headers: { Authorization: `HEHHEHA ${context.req.cookies.token}` } },
        fetchPolicy: 'no-cache'
    })
    return {
        props: { channels: getChannels, messages: getMessages }
    }
}

export default withAuth(ChannelTHingy)
