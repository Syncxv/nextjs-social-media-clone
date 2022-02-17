import { Box, Text, Stack } from '@chakra-ui/react'
import React from 'react'
import { SettingsHeader } from '.'
import Layout from '../../components/Layout'

interface Props {}

const SettingsProfile: React.FC<Props> = ({}) => {
    return (
        <Layout>
            <Stack>
                <SettingsHeader label="Profile" />
                <Box>
                    <Text>HEY</Text>
                </Box>
            </Stack>
        </Layout>
    )
}

export default SettingsProfile
