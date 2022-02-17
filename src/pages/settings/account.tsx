import { Box, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import Layout from '../../components/Layout'
import { PostHeader } from '../../components/moluclues/Post'

interface Props {}

const SettingsAccount: React.FC<Props> = ({}) => {
    return (
        <Layout>
            <Stack>
                <PostHeader label="Account" />
                <Box>
                    <Text>HEY</Text>
                </Box>
            </Stack>
        </Layout>
    )
}

export default SettingsAccount
