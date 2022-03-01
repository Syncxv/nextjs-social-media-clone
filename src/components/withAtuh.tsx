import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { _socketStore } from '../stores/socket'
import { userStore } from '../stores/user'
import { UserType } from '../types'
import Layout from './Layout'
export const useAuth = () => {
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
const withAuth = <T extends object>(Component: React.FC<T> | NextPage<T>, layout?: boolean) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const {
            loading,
            stores: { usrStore, socketStore }
        } = useAuth()
        const router = useRouter()
        if (loading) return <div>LOADING</div>
        if (usrStore.user === null || socketStore.socket === null) {
            router.push('/login')
            return <div>ERROR</div>
        }
        return layout ? (
            <Layout>
                <Component {...props} />
            </Layout>
        ) : (
            <Component {...props} />
        )
    }
}

export default withAuth
