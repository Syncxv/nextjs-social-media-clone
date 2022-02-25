import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Layout } from 'phosphor-react'
import { MessagesLayout } from '.'
import client from '../../apollo/client'
import { GET_CHANNELS_QUERY } from '../../apollo/queries/channel'
import { PostInfo } from '../../components/moluclues/Post'
import { ChannelType, PostType } from '../../types'

interface Props {
    channels: ChannelType[]
}

const ChannelTHingy: React.FC<Props> = ({ channels }) => {
    const router = useRouter()
    const channel = channels.find(s => s._id === router.query.channel_id)
    if (!channel) return <MessagesLayout channels={channels}>unkown channel eh</MessagesLayout>
    return (
        <>
            <MessagesLayout channels={channels}>{channel._id}</MessagesLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async context => {
    const {
        data: { getChannels }
    } = await client.query<{ getChannels: ChannelType[] }>({
        query: GET_CHANNELS_QUERY,
        context: { headers: { Authorization: `HEHHEHA ${context.req.cookies.token}` } }
    })
    return {
        props: { channels: getChannels }
    }
}

export default ChannelTHingy
