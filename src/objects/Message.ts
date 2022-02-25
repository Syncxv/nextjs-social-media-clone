import { _messageStore } from '../stores/messages'
import { ChannelType, MessageType, MESSAGE_STATES, UserType } from '../types'
import { GenericObject } from './GenericObject'

export class Message extends GenericObject {
    public content: string
    public author: UserType
    public channel: ChannelType
    public timestamp: Date
    constructor(public rawMessage: MessageType, public state: MESSAGE_STATES = MESSAGE_STATES.SENDING) {
        super(rawMessage._id)
        this.content = rawMessage.content
        this.author = rawMessage.author
        this.channel = rawMessage.channel
        this.timestamp = new Date(rawMessage.createdAt)
    }

    getChannelId(): string {
        return this.channel._id
    }

    updateSelf(message: Message) {
        const messageStore = _messageStore.getState()
        messageStore.updateMessage(this._id, message!)
    }

    static new(
        author: UserType,
        channel: ChannelType,
        content: string,
        state: MESSAGE_STATES = MESSAGE_STATES.SENDING
    ) {
        return new Message(
            { _id: Date.now().toString(), author, channel, content, createdAt: Date(), updatedAt: Date() },
            state
        )
    }

    //* and can add more features yk
}
