import { Box, HStack, Grid, GridItem } from '@chakra-ui/react'
import type { NextPage } from 'next'
import SideBar from '../components/organism/Sidebar'
import withAuth from '../components/withAtuh'

const Home: NextPage = () => {
    return (
        <>
            <HStack width="100vw" height="100vh">
                <SideBar />
                <Box backgroundColor="tomato">hi</Box>
            </HStack>
        </>
    )
}

export default withAuth(Home)
