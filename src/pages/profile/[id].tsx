import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../components/Layout'

interface Props {}

const ProfilePage: NextPage<Props> = ({}) => {
    return (
        <Layout>
            <div>ProfilePage</div>
        </Layout>
    )
}

export default ProfilePage
