import { HStack, Box } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import SideBar from '../organism/Sidebar'
import { useAuth } from '../withAtuh'
interface Props {}

const Layout: NextPage<Props> = ({ children }) => {
    const {
        loading,
        stores: { usrStore, socketStore }
    } = useAuth()
    const router = useRouter()
    if (loading) return <div>LOADING</div>
    if (usrStore.user === null || socketStore.socket === null) {
        router.push('/login')
        return <div>ERROR</div>
    }
    return (
        <HStack justifyContent="center" alignItems="flex-start" width="100vw" height="100vh">
            <SideBar />
            <Box overflowY="auto" maxH="100vh" minH="100vh" width="max(40%, 37rem)">
                {children}
            </Box>
        </HStack>
    )
}

export default Layout
