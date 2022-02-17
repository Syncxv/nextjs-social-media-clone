import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { userStore } from '../stores/user'
import { UserType } from '../types'
const useAuth = () => {
    const store = userStore()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        store
            .initalize()
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
    return { loading, store }
}
const withAuth = <T extends object>(Component: React.FC<T> | NextPage<T>) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const { loading, store } = useAuth()
        const router = useRouter()
        if (loading) return <div>LOADING</div>
        if (store.user === null) {
            router.push('/login')
            return <div>ERROR</div>
        }
        return <Component {...props} />
    }
}

export default withAuth
