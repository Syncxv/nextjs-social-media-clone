import { Button, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArchiveBox, UserCircle } from 'phosphor-react'
import React from 'react'
import Layout from '../../components/Layout'
import { PostHeader } from '../../components/moluclues/Post'
import withAuth from '../../components/withAtuh'

interface Props {}

const SettingsButton: React.FC<{ leftIcon: any; path: string }> = ({ leftIcon, path, children }) => {
    const router = useRouter()
    const relPath = `/settings${path}`
    const selected = router.pathname === relPath
    return (
        <Button
            backgroundColor={selected ? 'grey.300' : 'transparent'}
            onClick={() => router.push(relPath)}
            leftIcon={leftIcon}
            justifyContent="flex-start"
            _focus={{ boxShadow: 'none' }}
            size="md"
        >
            {children}
        </Button>
    )
}

const SettingsPage: React.FC<Props> = props => {
    return (
        <>
            <Layout>
                <Flex direction="column">
                    <PostHeader label="Settings" />
                    <Flex direction="column">
                        <SettingsButton path="/profile" leftIcon={<UserCircle size={20} />}>
                            Profile
                        </SettingsButton>
                        <SettingsButton path="/account" leftIcon={<ArchiveBox size={20} />}>
                            Account Setings
                        </SettingsButton>
                    </Flex>
                </Flex>
            </Layout>
        </>
    )
}

export default withAuth(SettingsPage)
