import produce from 'immer'
import create from 'zustand'
import { Message } from '../objects/Message'
import { ChannelType } from '../types'

export interface MessageStoreHehe {
    channels: { [key: string]: { channel: ChannelType; messages: Message[] } }
    addMessage: (id: string, message: Message) => void
    initalize: (channel: ChannelType, messages: Message[]) => void
    updateMessage: (prevMessageId: string, message: Message) => void
}

export const _messageStore = create<MessageStoreHehe>(set => ({
    channels: {},
    initalize: (channel: ChannelType, messages: Message[]) =>
        set(
            produce((state: MessageStoreHehe) => {
                state.channels[channel._id] = {} as any
                state.channels[channel._id].channel = channel
                state.channels[channel._id].messages = messages
            })
        ),
    addMessage: (id: string, message: Message) =>
        set(
            produce((state: MessageStoreHehe) => {
                state.channels[id].messages.push(message)
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
