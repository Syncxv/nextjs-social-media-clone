import { Box, Button, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ChatCircle, DotsThree, Gear, House, UserCircle } from 'phosphor-react'
import React from 'react'
import { userStore } from '../../../stores/user'

type Props = {}

const SideButton: React.FC<{ leftIcon: any; path?: string }> = ({ leftIcon, children, path }) => {
    const textColor = useColorModeValue('#646FA7', '#B5B7BF')
    const textHover = useColorModeValue('#2B5BFC', '#ffffff')
    const router = useRouter()
    const selected = router.pathname == path
    return (
        <Button
            width="100%"
            outline="none"
            backgroundColor={selected ? '#EBEFFD' : 'transparent'}
            justifyContent="flex-start"
            _focus={{ boxShadow: 'none' }}
            leftIcon={leftIcon}
            color={textColor}
            _hover={{
                background: selected ? 'transparent' : '#EBEFFD',
                color: textHover
            }}
            onClick={() => (path && router.pathname !== path ? router.push(path) : null)}
        >
            {children}
        </Button>
    )
}
const SideBar: NextPage<Props> = () => {
    const router = useRouter()
    const user = userStore(state => state.user)!
    console.log(router)
    return (
        <>
            <Box as="aside" height="100%" width="15rem" padding="2rem .5rem">
                <Flex justifyContent="flex-start" direction="column">
                    <Heading padding="0 1rem" mb={9}>
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            h="3.5rem"
                            w="3.5rem"
                            borderRadius="16px"
                            backgroundColor="#3761ee"
                            color="white"
                            fontSize="2xl"
                        >
                            B
                        </Flex>
                    </Heading>
                    <Flex direction="column" gap={2} as="section" width="100%">
                        <Text fontSize="xs" color="grey" ml="1rem">
                            NAVIGATION
                        </Text>
                        <SideButton path="/" leftIcon={<House size={20} />}>
                            Home
                        </SideButton>
                        <SideButton path="/messages" leftIcon={<ChatCircle size={20} />}>
                            Messages
                        </SideButton>
                        <SideButton path={`/profile/${user.username}`} leftIcon={<UserCircle size={20} />}>
                            Profile
                        </SideButton>
                    </Flex>
                    <Flex direction="column" gap={2} as="section" mt={8} width="100%">
                        <Text fontSize="xs" color="grey" ml="1rem">
                            CUSTOMIZATION
                        </Text>
                        <SideButton path="/settings" leftIcon={<Gear size={20} />}>
                            Settings
                        </SideButton>
                        <SideButton leftIcon={<DotsThree size={20} />}>More</SideButton>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default SideBar
