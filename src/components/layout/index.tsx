import { HStack, Box } from '@chakra-ui/react'
import { NextPage } from 'next'
import React from 'react'
import SideBar from '../organism/Sidebar'
import withAuth from '../withAtuh'

interface Props {}

const Layout: NextPage<Props> = ({ children }) => {
    return (
        <HStack width="100vw" height="100vh">
            <SideBar />
            {children}
        </HStack>
    )
}

export default withAuth(Layout)
