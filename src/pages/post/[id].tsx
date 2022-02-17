import { Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { PostInfo } from '../../components/moluclues/Post'
import { useGetPostData } from '../../hooks/useGetPost'

interface Props {}

const PostInfoPage: React.FC<Props> = () => {
    const {
        query: { id }
    } = useRouter()
    const [i, setI] = useState(0)
    const { data, loading, client } = useGetPostData(id as string, i)
    const forceUpdate = () => setI(i + 1)
    if (loading) return <Text>LOADING</Text>
    return <Layout>{data ? <PostInfo forceUpdate={forceUpdate} post={data} /> : <Text>Bruh</Text>}</Layout>
}

export default PostInfoPage
