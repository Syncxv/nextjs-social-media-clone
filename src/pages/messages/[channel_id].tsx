import { useMutation } from '@apollo/client'
import { Avatar, Box, Flex, Heading, IconButton, Input, Text } from '@chakra-ui/react'
import { GetServerSideProps, NextPage, NextPageContext } from 'next'
import Router, { useRouter } from 'next/router'
import { EnvelopeOpen, ImageSquare, PaperPlaneRight } from 'phosphor-react'
import React, { useEffect, useRef, useState } from 'react'
import { MessagesLayoutDefault } from '.'
import client from '../../apollo/client'
import { CREATE_MESSAGE_MUTATION } from '../../apollo/mutations/message'
import { GET_CHANNELS_QUERY } from '../../apollo/queries/channel'
import { GET_MESSAGES_QUERY } from '../../apollo/queries/messages'
import withAuth from '../../components/withAtuh'
import useInView from '../../hooks/useInView'
import { Message } from '../../objects/Message'
import { MessageStoreHehe, _messageStore } from '../../stores/messages'
import { userStore, UserStoreHehe } from '../../stores/user'
import { ChannelType, MessageType, MESSAGE_STATES, UserType } from '../../types'
import { Channel } from '.'
interface Props {
    channels: ChannelType[]
    messages: MessageType[]
    messageStore: MessageStoreHehe
    userStore: UserStoreHehe
}
const MessageComponent: React.FC<{ message: Message; user: UserType }> = ({ message, user }) => {
    const isCurrentUser = user._id === message.author._id
    return (
        <>
            <Box
                px={3}
                py={2}
                borderRadius="16px"
                {...{ [isCurrentUser ? 'borderBottomRightRadius' : 'borderBottomLeftRadius']: '0px' }}
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
const MessagePlaceHolder: React.FC = () => {
    const isCurrentUser = Math.random() < 0.8
    return (
        <>
            <Box
                className="place-holder"
                px={3}
                py={2}
                borderRadius="16px"
                {...{ [isCurrentUser ? 'borderBottomRightRadius' : 'borderBottomLeftRadius']: '0px' }}
                backgroundColor="gray.300"
                alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
            >
                <Text color="transparent">"HEHE"</Text>
            </Box>
        </>
    )
}

class BetterChannelThingy extends React.Component<Props, { initalized: boolean }> {
    channel: ChannelType
    scrollableRef: React.RefObject<HTMLDivElement>
    placeHolderRef: React.RefObject<HTMLDivElement>
    toScrollRef: React.RefObject<HTMLDivElement>
    inputRef: React.RefObject<HTMLInputElement>
    resizeObserver: ResizeObserver
    intersectionObserver: IntersectionObserver
    constructor(props: any) {
        super(props)
        this.state = {
            initalized: true
        }
        console.log(this.props)
        this.channel = this.props.channels.find(s => s._id === Router.query.channel_id)!
        this.scrollableRef = React.createRef()
        this.placeHolderRef = React.createRef()
        this.toScrollRef = React.createRef()
        this.inputRef = React.createRef()
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this))
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
            threshold: 0
        })
        this.getScrollState = this.getScrollState.bind(this)
        this.props.messageStore.initalize(
            this.channel,
            this.props.messages.map(s => new Message(s, MESSAGE_STATES.SENT)),
            () => {}
        )
    }

    componentDidMount() {
        console.log('MOUNTED', this.toScrollRef, this.placeHolderRef, this.props)
        this.resizeObserver.observe(this.scrollableRef.current!)
        setTimeout(() => {
            if (this.placeHolderRef.current) {
                this.intersectionObserver.observe(this.placeHolderRef.current!)
            }
        }, 10)
    }

    componentWillUnmount() {
        this.resizeObserver.unobserve(this.scrollableRef.current!)
    }

    render() {
        const { channels, userStore, messageStore } = this.props
        if (!this.channel) return <MessagesLayoutDefault channels={channels}>bru wot</MessagesLayoutDefault>
        const recivingMember = this.channel.members.find(s => s._id !== userStore.user!._id)!
        return (
            <>
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
                            <Channel key={i} channel={chan} user={userStore.user!} />
                        ))}
                    </Box>
                    <Box borderRight="1px" borderColor="gray.200" as="section" width="100%">
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
                                    <Avatar
                                        size="xs"
                                        name={recivingMember.username}
                                        src={recivingMember.avatar}
                                    />
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
                                ref={this.scrollableRef}
                                overflowY="auto"
                                maxHeight="85vh"
                                px={4}
                                mb={5}
                                alignItems="flex-end"
                                flexGrow="1"
                                direction="column"
                                gap={2}
                            >
                                {messageStore.channels[this.channel._id]?.hasMore && (
                                    <Flex direction="column" gap={2} width="100%" ref={this.placeHolderRef}>
                                        {Array.from(Array(10)).map((_, i) => (
                                            <MessagePlaceHolder key={i} />
                                        ))}
                                    </Flex>
                                )}
                                {messageStore.channels[this.channel._id]?.messages &&
                                    messageStore.channels[this.channel._id]?.messages.map((msg, i) => (
                                        <MessageComponent key={i} message={msg} user={userStore.user!} />
                                    ))}
                                <div ref={this.toScrollRef}></div>
                            </Flex>
                            <form onSubmit={this.handleSubmit.bind(this)}>
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
                                        ref={this.inputRef}
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
                    </Box>
                </Flex>
            </>
        )
    }

    handleIntersection([entry]: IntersectionObserverEntry[]) {
        setTimeout(async () => {
            console.log(this.state, this.props)
            const scrollState = this.getScrollState()
            if (scrollState) {
                const heightTakeAwayOffesetHeight = scrollState.scrollHeight - scrollState.offsetHeight
                console.log(
                    'heightTakeAwayOffesetHeight:',
                    heightTakeAwayOffesetHeight,
                    'scrollTop',
                    scrollState.scrollTop
                )

                if (
                    this.state.initalized &&
                    entry.isIntersecting &&
                    !(heightTakeAwayOffesetHeight === scrollState.scrollTop) &&
                    this.props.messageStore.channels[this.channel._id].hasMore
                ) {
                    //CAN FETCH MESSAGES :D HOLY SHIT
                    console.log(entry, this.getScrollState())
                    const {
                        data: { getMessages }
                    } = await client.query<{ getMessages: MessageType[] }>({
                        query: GET_MESSAGES_QUERY,
                        variables: {
                            channelId: this.channel._id,
                            before: this.props.messageStore.channels[this.channel._id].messages[0]._id
                        },
                        fetchPolicy: 'no-cache'
                    })
                    console.log(getMessages)
                    this.props.messageStore.addMessages(
                        this.channel._id,
                        getMessages.map(s => new Message(s))
                    )
                    this.forceUpdate()
                }
            }
        }, 100)
    }

    handleResize(e: ResizeObserverEntry[]) {
        console.log(e, e[0].target.childElementCount)
        if (
            this.getScrollState()?.scrollTop === 0 &&
            this.props.messageStore.channels[this.channel._id].hasMore
        ) {
            this.scrollableRef.current?.scrollTo(0, Number.MAX_SAFE_INTEGER)
            this.setState({ initalized: true })
        }
    }
    async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!this.inputRef.current?.value.length) return
        const user = this.props.userStore.user!
        const channel = this.channel
        console.log('BEFORE', Object.values(this.props.messageStore.channels[channel._id].messages))
        const heheMessage = Message.new(user, channel, this.inputRef.current!.value)
        this.props.messageStore.addMessage(heheMessage)
        try {
            const { data } = await client.mutate({
                mutation: CREATE_MESSAGE_MUTATION,
                variables: {
                    channelId: channel._id,
                    content: this.inputRef.current?.value
                }
            })
            const message = data!.createMessage.message
            heheMessage.updateSelf(
                Message.new(message.author, message.channel, message.content, MESSAGE_STATES.SENT)
            )
            this.toScrollRef.current?.scrollIntoView()
            console.log(data?.createMessage, 'BRUH')
        } catch {
            heheMessage.state = MESSAGE_STATES.ERROR
            heheMessage.updateSelf(heheMessage)
            this.toScrollRef.current?.scrollIntoView()
        }
        console.log('AFTER', Object.values(this.props.messageStore.channels[channel._id].messages))
        this.inputRef.current!.value = ''
    }
    getScrollState(elem?: HTMLDivElement) {
        if (!elem) {
            const div = this.scrollableRef.current!
            if (div) {
                return {
                    scrollTop: div.scrollTop,
                    scrollLeft: div.scrollLeft,
                    scrollHeight: div.scrollHeight,
                    scrollWidth: div.scrollWidth,
                    offsetHeight: div.offsetHeight,
                    offsetWidth: div.offsetWidth,
                    clientHeight: div.clientHeight,
                    offsetTop: div.offsetTop
                }
            }
        }
        if (elem) {
            return {
                scrollTop: elem.scrollTop,
                scrollLeft: elem.scrollLeft,
                scrollHeight: elem.scrollHeight,
                scrollWidth: elem.scrollWidth,
                offsetHeight: elem.offsetHeight,
                offsetWidth: elem.offsetWidth,
                clientHeight: elem.clientHeight,
                offsetTop: elem.offsetTop
            }
        }
    }
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
export const withStore = <T extends object>(Component: React.FC<T> | NextPage<T>) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const messageStore = _messageStore()
        const usrStore = userStore()
        return <Component {...props} messageStore={messageStore} userStore={usrStore} />
    }
}
export default withAuth(BetterChannelThingy, true, true)
