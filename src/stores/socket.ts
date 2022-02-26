import produce from 'immer'
import create, { GetState, SetState, StoreApi } from 'zustand'
import { apiUrl, MessageType, MESSAGE_STATES, SOCKET_ACTIONS } from '../types'
import { io, Socket } from 'socket.io-client'
import { _messageStore } from './messages'
import { Message } from '../objects/Message'
export interface SocketStoreHEHE {
    socket: Socket | null
    openConnection: () => Promise<boolean | any>
}

export const _socketStore = create<
    SocketStoreHEHE,
    SetState<SocketStoreHEHE>,
    GetState<SocketStoreHEHE>,
    StoreApi<SocketStoreHEHE>
>((set, get) => ({
    socket: null,
    openConnection: () => {
        const messageStore = _messageStore.getState()
        const socket = io(apiUrl, {
            query: {
                token: localStorage.getItem('token')
            }
        })
        return new Promise((res, rej) => {
            socket.on('connect', () => {
                set(
                    produce((state: SocketStoreHEHE) => {
                        state.socket = socket
                        res(true)
                    })
                )
            })

            socket.on('connect_error', e => rej(e))
            socket.on(SOCKET_ACTIONS.RECIVE_MESSAGE, (e: MessageType) => {
                console.log(e)
                const msg = new Message(e, MESSAGE_STATES.SENT)
                messageStore.addMessage(msg.getChannelId(), msg)
            })
        })
    }
}))
