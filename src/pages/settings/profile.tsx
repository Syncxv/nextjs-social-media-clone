import { Box, Text, Stack } from '@chakra-ui/react'
import React from 'react'
import Layout from '../../components/Layout'
import { PostHeader } from '../../components/moluclues/Post'

interface Props {}

const SettingsProfile: React.FC<Props> = ({}) => {
    return (
        <Layout>
            <Stack>
                <PostHeader label="Profile" />
                <Box>
                    <Text>HEY</Text>
                </Box>
            </Stack>
        </Layout>
    )
}

export default SettingsProfile
