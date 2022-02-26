import produce from 'immer'
import create from 'zustand'
import { Message } from '../objects/Message'
import { ChannelType } from '../types'

export interface MessageStoreHehe {
    channels: { [key: string]: { channel: ChannelType; messages: Message[] } }
    addMessage: (message: Message) => void
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
                state.channels[channel._id] = { channel, messages }
                state.scrollToBottom = func
            })
        ),
    addMessage: async (message: Message) =>
        set(
            produce((state: MessageStoreHehe) => {
                if (!state.channels[message.getChannelId()])
                    state.channels[message.getChannelId()] = { channel: message.channel, messages: [] }
                state.channels[message.getChannelId()].messages.push(message)
                state.scrollToBottom()
            })
        ),
    updateMessage: (prevMessageId: string, message: Message) =>
        set(
            produce((state: MessageStoreHehe) => {
                const channel = state.channels[message.getChannelId()]
                const idx = channel.messages.map(s => s._id).indexOf(prevMessageId)
                channel.messages[idx] = message
            })
        )
}))
