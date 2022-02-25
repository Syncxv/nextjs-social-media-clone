import { Box, Center, Flex } from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import React from 'react'
import client from '../../apollo/client'
import { GET_CHANNELS_QUERY } from '../../apollo/queries/channel'
import Layout from '../../components/Layout'
import { ChannelType } from '../../types'
import { _socketStore } from '../../stores/socket'
import { userStore } from '../../stores/user'
import withAuth from '../../components/withAtuh'
interface Props {
    channels: ChannelType[]
}

const Messages: React.FC<Props> = ({ channels }) => {
    console.log(channels)
    return (
        <Layout>
            <Flex minHeight="100vh" as="main">
                <Box border="1px" borderColor="gray.200" as="section" width="75%">
                    hey
                </Box>
                <Center borderRight="1px" borderColor="gray.200" as="section" width="100%">
                    bru select a message
                </Center>
            </Flex>
        </Layout>
    )
}
export const getServerSideProps: GetServerSideProps = async context => {
    const {
        data: { getChannels }
    } = await client.query<{ getChannels: ChannelType[] }>({
        query: GET_CHANNELS_QUERY,
        context: { headers: { Authorization: `HEHHEHA ${context.req.cookies.token}` } }
    })
    return {
        props: { channels: getChannels }
    }
}
export default withAuth(Messages)
