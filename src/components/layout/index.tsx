import { HStack, Box } from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'
import SideBar from '../organism/Sidebar'
import withAuth from '../withAtuh'

interface Props {}

const Layout: NextPage<Props> = ({ children }) => {
    return (
        <HStack alignItems="flex-start" width="100vw" height="100vh">
            <SideBar />
            <Box width="100%">{children}</Box>
        </HStack>
    )
}

export default withAuth(Layout)
