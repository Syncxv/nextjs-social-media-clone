import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    Flex,
    Avatar,
    Textarea,
    Wrap,
    CloseButton,
    ModalFooter,
    IconButton,
    Button,
    Image,
    Fade,
    Box
} from '@chakra-ui/react'
import { Rectangle, Image as ImageIcon } from 'phosphor-react'
import { useRef, useState } from 'react'
import { useReply } from '../../../hooks/useReply'
import { PostType, UserType } from '../../../types'

interface ReplyModalProps {
    isOpen: boolean
    onClose: any
    user: UserType
    post: PostType
    forceUpdate: any
}
export const ReplyThingy: React.FC<{ user: UserType; post: PostType; forceUpdate: any }> = ({
    user,
    post,
    forceUpdate
}) => {
    const [isOpen, setOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const { reply, setImage, image } = useReply(post, textareaRef)
    return (
        <>
            <Flex
                alignItems="center"
                direction={isOpen ? 'column' : 'row'}
                borderBottom="1px"
                borderColor="gray.200"
                py={2}
                px={4}
                width="100%"
            >
                <Flex width="100%" gap={2}>
                    <Avatar name={user.username} src={user.avatar} />
                    <Flex width="100%" direction="column">
                        <Textarea
                            ref={textareaRef}
                            placeholder="Reply ong on me"
                            size="sm"
                            resize="none"
                            border="none"
                            width="100%"
                            fontSize="1rem"
                            minHeight={isOpen ? '80px' : '50px'}
                            onFocus={() => !isOpen && setOpen(true)}
                            _focus={{ boxShadow: 'none' }}
                        />
                        <Wrap position="relative">
                            {image !== null && (
                                <>
                                    <CloseButton
                                        position="absolute"
                                        top={3}
                                        left={3}
                                        backgroundColor="#ffffffa9"
                                        borderRadius="50%"
                                        onClick={() => setImage(null)}
                                        _focus={{ boxShadow: 'none' }}
                                        _hover={{
                                            backgroundColor: '#ffffffd5'
                                        }}
                                    />
                                    <Image borderRadius={16} src={URL.createObjectURL(image)} alt="wel[" />
                                </>
                            )}
                        </Wrap>
                    </Flex>
                </Flex>
                <Flex width="100%" justifyContent="space-between">
                    <Fade style={{ width: 'auto' }} delay={0.2} in={isOpen}>
                        <Box marginLeft="3.5rem">
                            <IconButton
                                aria-label="Select Image"
                                backgroundColor="transparent"
                                icon={<ImageIcon />}
                                borderRadius="50%"
                                onClick={() => fileInputRef.current?.click()}
                                _focus={{ boxShadow: 'none' }}
                                _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.37)' }}
                            />
                            <input
                                onChange={e => setImage(e.target.files?.length ? e.target.files[0] : null)}
                                type="file"
                                accept="image/png, image/jpeg"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                            />
                            <IconButton
                                aria-label="Select Image"
                                backgroundColor="transparent"
                                icon={<Rectangle />}
                                onClick={() => setOpen(false)}
                                borderRadius="50%"
                                _focus={{ boxShadow: 'none' }}
                                _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.37)' }}
                            />
                        </Box>
                    </Fade>
                    <Flex alignItems="center">
                        <Button
                            color="white"
                            backgroundColor="rgba(88, 77, 255, 1)"
                            borderRadius={30}
                            onClick={() => {
                                reply().then(() => {
                                    forceUpdate()
                                    setImage(null)
                                    if (textareaRef.current) textareaRef.current.value = ''
                                })
                            }}
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.9)' }}
                        >
                            Reply
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
export const ReplyModal: React.FC<ReplyModalProps> = ({ isOpen, onClose, user, post, forceUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const { reply, setImage, image } = useReply(post, textareaRef)
    return (
        <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton left={3} _focus={{ boxShadow: 'none' }} />
                <ModalBody mt={10}>
                    <Flex gap={2}>
                        <Avatar name={user.username} src={user.avatar} />

                        <Flex direction="column">
                            <Textarea
                                ref={textareaRef}
                                placeholder="Reply ong on me"
                                size="sm"
                                resize="none"
                                border="none"
                                _focus={{ boxShadow: 'none' }}
                            />
                            <Wrap position="relative">
                                {image !== null && (
                                    <>
                                        <CloseButton
                                            position="absolute"
                                            top={3}
                                            left={3}
                                            backgroundColor="#ffffffa9"
                                            borderRadius="50%"
                                            onClick={() => setImage(null)}
                                            _focus={{ boxShadow: 'none' }}
                                            _hover={{
                                                backgroundColor: '#ffffffd5'
                                            }}
                                        />
                                        <Image
                                            borderRadius={16}
                                            src={URL.createObjectURL(image)}
                                            alt="wel["
                                        />
                                    </>
                                )}
                            </Wrap>
                        </Flex>
                    </Flex>
                </ModalBody>

                <ModalFooter justifyContent="space-between">
                    <Wrap marginLeft="3.5rem">
                        <IconButton
                            aria-label="Select Image"
                            backgroundColor="transparent"
                            icon={<ImageIcon />}
                            borderRadius="50%"
                            onClick={() => fileInputRef.current?.click()}
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.37)' }}
                        />
                        <input
                            onChange={e => setImage(e.target.files?.length ? e.target.files[0] : null)}
                            type="file"
                            accept="image/png, image/jpeg"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <IconButton
                            aria-label="Select Image"
                            backgroundColor="transparent"
                            icon={<Rectangle />}
                            borderRadius="50%"
                            _focus={{ boxShadow: 'none' }}
                            _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.37)' }}
                        />
                    </Wrap>
                    <Button
                        color="white"
                        backgroundColor="rgba(88, 77, 255, 1)"
                        borderRadius={30}
                        onClick={() => {
                            reply().then(() => {
                                forceUpdate()
                                onClose()
                            })
                        }}
                        _focus={{ boxShadow: 'none' }}
                        _hover={{ backgroundColor: 'rgba(88, 77, 255, 0.9)' }}
                    >
                        Reply
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
