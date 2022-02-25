import produce from 'immer'
import create from 'zustand'
import { Message } from '../objects/Message'
import { ChannelType } from '../types'

export interface MessageStoreHehe {
    channels: { [key: string]: { channel: ChannelType; messages: { [key: string]: Message } } }
    addMessage: (id: string, message: Message) => void
    initalize: (channel: ChannelType, messages: Message[]) => void
    updateMessage: (id: string, message: Message) => void
}

export const _messageStore = create<MessageStoreHehe>(set => ({
    channels: {},
    initalize: (channel: ChannelType, messages: Message[]) =>
        set(
            produce((state: MessageStoreHehe) => {
                state.channels[channel._id] = {} as any
                state.channels[channel._id].messages = {} as any
                state.channels[channel._id].channel = channel
                messages.forEach(s => (state.channels[channel._id].messages[s._id] = s))
            })
        ),
    addMessage: (id: string, message: Message) =>
        set(
            produce((state: MessageStoreHehe) => {
                const bruh = state.channels[id]
                bruh.messages[message._id] = message
            })
        ),
    updateMessage: (id: string, message: Message) =>
        set(
            produce((state: MessageStoreHehe) => {
                state.channels[id].messages[message._id] = message
            })
        )
}))
