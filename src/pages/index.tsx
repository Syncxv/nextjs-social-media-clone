import type { NextPage } from 'next'
import SideBar from '../components/organism/Sidebar'
import withAuth from '../components/withAtuh'

const Home: NextPage = () => {
    return (
        <>
            <div>hi</div>
        </>
    )
}

export default withAuth(Home)
