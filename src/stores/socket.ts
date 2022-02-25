import produce from 'immer'
import create, { GetState, SetState, StoreApi } from 'zustand'
import { apiUrl } from '../types'
import { io, Socket } from 'socket.io-client'
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
        })
    }
}))
