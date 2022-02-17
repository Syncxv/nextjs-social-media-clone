import create from 'zustand'
import client from '../apollo/client'
import { ME_QUERY } from '../apollo/queries/me'
import { Errors, UserType } from '../types'

export interface UserStoreHehe {
    user: UserType | null
    initalized: boolean
    setUser: (user: UserType) => void
    initalize: () => Promise<{ erros: Errors[]; me: UserType }>
}

export const userStore = create<UserStoreHehe>(set => ({
    initalized: false,
    user: null,
    setUser: (user: UserType) => set(state => ({ ...state, user })),
    initalize: async () => {
        const { data } = await client.query<{ erros: Errors[]; me: UserType }>({ query: ME_QUERY })
        set(state => ({ ...state, initalized: true, user: data.me }))
        return data
    }
}))
