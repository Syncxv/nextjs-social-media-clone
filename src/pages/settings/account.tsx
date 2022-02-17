import { Box, Heading, IconButton, Stack, Text, Wrap } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'phosphor-react'
import React from 'react'
import { SettingsHeader } from '.'
import Layout from '../../components/Layout'

interface Props {}

const SettingsAccount: React.FC<Props> = ({}) => {
    return (
        <Layout>
            <Stack>
                <SettingsHeader label="Account" />
                <Box>
                    <Text>HEY</Text>
                </Box>
            </Stack>
        </Layout>
    )
}

export default SettingsAccount
