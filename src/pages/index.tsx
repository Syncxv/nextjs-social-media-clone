import type { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import client from '../apollo/client'
import { GET_POSTS_QUERY } from '../apollo/queries/posts'
import Layout from '../components/Layout'
import Post, { PostHeader } from '../components/moluclues/Post'
import { _postStore } from '../stores/post'
import { PostType } from '../types'

const Home: NextPage<{ posts: PostType[] }> = ({ posts }) => {
    const postStore = _postStore()
    useEffect(() => {
        postStore.setPosts(posts)
    }, [])
    console.log(posts, postStore)
    return (
        <>
            <Layout>
                <PostHeader hideIcon={true} label="Home" />
                {posts.map((post, i) => (
                    <Post key={i} post={post} />
                ))}
            </Layout>
        </>
    )
}
export const getServerSideProps: GetServerSideProps = async context => {
    const {
        data: { getPosts }
    } = await client.query<{ getPosts: PostType[] }>({ query: GET_POSTS_QUERY })
    return {
        props: { posts: getPosts }
    }
}
export default Home
