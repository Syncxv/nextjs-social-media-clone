import { Button } from '@mantine/core'
import type { NextPage } from 'next'
import withAuth from '../components/withAtuh'

const Home: NextPage = () => {
    return (
        <div>
            <span>HEHEHEHEHHEHE HA</span>
            <Button color="gray"> HAHHA </Button>
        </div>
    )
}

export default withAuth(Home)
