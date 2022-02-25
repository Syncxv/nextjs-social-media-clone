import { Text, useForceUpdate } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import React from 'react'
import client from '../../apollo/client'
import { GET_POST_QUERY } from '../../apollo/queries/posts'
import Layout from '../../components/Layout'
import { PostInfo } from '../../components/moluclues/Post'
import { PostType } from '../../types'

interface Props {
    post?: PostType
}

const PostInfoPage: React.FC<Props> = ({ post }) => {
    const forceUpdate = useForceUpdate()
    return <Layout>{post ? <PostInfo forceUpdate={forceUpdate} post={post} /> : <Text>Bruh</Text>}</Layout>
}
export const getServerSideProps: GetServerSideProps = async context => {
    try {
        const {
            data: { getPost }
        } = await client.query<{ getPost: PostType }>({
            query: GET_POST_QUERY,
            variables: { post_id: context?.params?.id }
        })
        return {
            props: { post: getPost }
        }
    } catch {
        return {
            props: { post: null }
        }
    }
}
export default PostInfoPage
