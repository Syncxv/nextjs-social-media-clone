import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { _messageStore } from '../stores/messages'
import { _socketStore } from '../stores/socket'
import { userStore } from '../stores/user'
import { UserType } from '../types'
import Layout from './Layout'
const useAuth = () => {
    const usrStore = userStore()
    const socketStore = _socketStore()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const auth = async () => {
            await usrStore.initalize()
            await socketStore.openConnection()
        }
        auth()
            .then(res => {
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return { loading, stores: { usrStore, socketStore } }
}
const withAuth = <T extends object>(
    Component: React.FC<T> | NextPage<T>,
    layout?: boolean,
    store?: boolean
) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const {
            loading,
            stores: { usrStore, socketStore }
        } = useAuth()
        const router = useRouter()
        const _userStore = userStore()
        const messageStore = _messageStore()
        if (loading) return <div>LOADING</div>
        if (usrStore.user === null || socketStore.socket === null) {
            router.push('/login')
            return <div>ERROR</div>
        }
        const hehe = store ? { messageStore, userStore: _userStore } : {}
        return layout ? (
            <Layout>
                <Component {...props} {...hehe} />
            </Layout>
        ) : (
            <Component {...props} {...hehe} />
        )
    }
}

export default withAuth
