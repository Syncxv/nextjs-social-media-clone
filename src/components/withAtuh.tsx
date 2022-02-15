import { NextPage } from 'next'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { userStore, UserStoreHehe } from '../stores/user'
import { UserType } from '../types'
const useAuth = () => {
    const store = userStore()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<UserType | null>(null)
    const [error, setError] = useState(false)
    useEffect(() => {
        store
            .initalize()
            .then(() => {
                setData(store.user)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                setError(true)
            })
            .finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}
const withAuth = <T extends object>(Component: React.FC<T> | NextPage<T>) => {
    return (props: any) => {
        const { loading, error } = useAuth()
        if (error) {
            Router.push('/login')
        }
        if (loading) return <div>LOADING</div>
        return <Component {...props} />
    }
}

export default withAuth
