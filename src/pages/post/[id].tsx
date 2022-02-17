import { useApolloClient } from '@apollo/client'
import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { GET_POSTS_QUERY, GET_POST_QUERY } from '../../apollo/queries/posts'
import Layout from '../../components/Layout'
import { PostInfo } from '../../components/moluclues/Post'
import withAuth from '../../components/withAtuh'
import { useGetPostData } from '../../hooks/useGetPost'

interface Props {}

const PostInfoPage: React.FC<Props> = () => {
    const {
        query: { id }
    } = useRouter()
    const { data, loading } = useGetPostData(id as string)
    if (loading) return <Text>LOADING</Text>
    return <Layout>{data ? <PostInfo post={data} /> : <Text>Bruh</Text>}</Layout>
}

export default withAuth(PostInfoPage)
