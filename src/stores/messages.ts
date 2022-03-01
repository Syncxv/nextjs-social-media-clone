import produce from 'immer'
import create from 'zustand'
import { Message } from '../objects/Message'
import { ChannelType } from '../types'

export interface MessageStoreHehe {
    channels: {
        [key: string]: { initalized: boolean; channel: ChannelType; messages: Message[]; hasMore: boolean }
    }
    addMessage: (message: Message) => void
    addMessages: (id: string, messages: Message[]) => void
    initalize: (channel: ChannelType, messages: Message[], func: any) => void
    updateMessage: (prevMessageId: string, message: Message) => void
    scrollToBottom: () => void
}

export const _messageStore = create<MessageStoreHehe>(set => ({
    channels: {},
    scrollToBottom: () => {},
    initalize: (channel: ChannelType, messages: Message[], func) =>
        set(
            produce((state: MessageStoreHehe) => {
                state.channels[channel._id] = {
                    initalized: false,
                    channel,
                    messages,
                    hasMore: messages.length === 50
                }
                state.scrollToBottom = func
                state.channels[channel._id].initalized = true
            })
        ),
    addMessage: async (message: Message) =>
        set(
            produce((state: MessageStoreHehe) => {
                if (!state.channels[message.getChannelId()])
                    state.channels[message.getChannelId()] = {
                        initalized: false,
                        channel: message.channel,
                        messages: [],
                        hasMore: true
                    }
                state.channels[message.getChannelId()].messages.push(message)
                state.channels[message.getChannelId()].initalized = true
                state.scrollToBottom()
            })
        ),
    addMessages: (id: string, messages: Message[]) => {
        set(
            produce((state: MessageStoreHehe) => {
                if (messages.length) {
                    const channel = state.channels[messages[0].getChannelId()]
                    if (!channel)
                        state.channels[messages[0].getChannelId()] = {
                            initalized: true,
                            channel: messages[0].channel,
                            messages: [],
                            hasMore: messages.length === 50
                        }
                    channel.hasMore = messages.length === 50
                    channel.messages.unshift(...messages)
                } else {
                    state.channels[id].hasMore = false
                }
            })
        )
    },
    updateMessage: (prevMessageId: string, message: Message) =>
        set(
            produce((state: MessageStoreHehe) => {
                const channel = state.channels[message.getChannelId()]
                const idx = channel.messages.map(s => s._id).indexOf(prevMessageId)
                channel.messages[idx] = message
            })
        )
}))
