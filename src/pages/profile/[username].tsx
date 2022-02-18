import { useQuery } from '@apollo/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { GET_USER_BY_USERNAME_QUERY } from '../../apollo/queries/user'
import Layout from '../../components/Layout'
import { UserType } from '../../types'

interface Props {}

const ProfilePage: NextPage<Props> = ({}) => {
    const router = useRouter()
    const { loading, data, error } = useQuery<{ findUser: UserType }>(GET_USER_BY_USERNAME_QUERY, {
        variables: { username: router.query.username }
    })
    if (loading) return <div>Loading</div>
    if (!data || error) return <div>Not found eh</div>
    return (
        <Layout>
            <div>{data.findUser.username}</div>
        </Layout>
    )
}

export default ProfilePage
