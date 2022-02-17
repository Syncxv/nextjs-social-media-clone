import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { userStore } from '../stores/user'
import { UserType } from '../types'
const useAuth = () => {
    const store = userStore()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<UserType | null>(null)
    const [error, setError] = useState(false)
    useEffect(() => {
        store
            .initalize()
            .then(res => {
                if (res.erros) {
                    setError(true)
                    setLoading(false)
                } else {
                    setData(res as any)
                    setLoading(false)
                }
            })
            .catch(err => {
                setLoading(false)
                setError(true)
            })
            .finally(() => {
                setLoading(false)
                setError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return { data, loading, error }
}
const withAuth = <T extends object>(Component: React.FC<T> | NextPage<T>) => {
    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const { loading, error, data } = useAuth()
        const router = useRouter()
        if (loading) return <div>LOADING</div>
        if (error || data === null) {
            router.push('/login')
            return <div>ERROR</div>
        }
        console.log(loading, error, data)
        return <Component {...props} />
    }
}

export default withAuth
