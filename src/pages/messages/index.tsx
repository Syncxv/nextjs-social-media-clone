import { Box, Center, Flex } from '@chakra-ui/react'
import React from 'react'
import Layout from '../../components/Layout'

interface Props {}

const Messages: React.FC<Props> = ({}) => {
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

export default Messages
