import { Box } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Layout from '../components/layout'
import withAuth from '../components/withAtuh'

const Home: NextPage = () => {
    return (
        <>
            <Layout>
                <Box>hi</Box>
            </Layout>
        </>
    )
}

export default withAuth(Home)
