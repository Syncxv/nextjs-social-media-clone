import { gql, useApolloClient } from '@apollo/client'
import create from 'zustand'
import client from '../apollo/client'
import { ME_QUERY } from '../apollo/queries/me'
import { UserType } from '../types'

export interface UserStoreHehe {
    user: UserType | null
    initalized: boolean
    setUser: (user: UserType) => void
    initalize: () => Promise<void>
}

export const userStore = create<UserStoreHehe>(set => ({
    initalized: false,
    user: null,
    setUser: (user: UserType) => set(state => ({ ...state, user })),
    initalize: async () => {
        const {
            data: { me }
        } = await client.query<{ me: UserType }>({ query: ME_QUERY })
        set(state => ({ ...state, initalized: true, user: me }))
    }
}))
