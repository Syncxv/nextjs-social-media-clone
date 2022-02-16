import { useMutation } from '@apollo/client'
import {
    FormControl,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    FormHelperText,
    InputRightElement,
    Stack,
    Link,
    FormLabel
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Router from 'next/router'
import { Lock, UserCircle } from 'phosphor-react'
import { useState } from 'react'
import styled from 'styled-components'
import { LOGIN_MUTATION } from '../apollo/mutations/Login'
import { LoginResponse } from '../types'
export const CenterForm = styled.form`
    display: grid;
    place-content: center;
    height: 100vh;
`

const Login: NextPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [login] = useMutation(LOGIN_MUTATION, {
        onCompleted: ({ userLogin: res }: LoginResponse) => {
            console.log(res)
            if (res.errors !== null) {
                return res.errors.forEach(err => {
                    // form.setFieldError(err.field as 'password' | 'username', err.message)
                })
            }
            localStorage.setItem('token', res.accessToken)
            Router.push('/')
        }
    })
    const handleShowClick = () => setShowPassword(!showPassword)
    return (
        <>
            <CenterForm onSubmit={() => console.log('WOO')}>
                <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                children={<UserCircle size={20} color="gray" />}
                            />
                            <Input type="text" id="email" placeholder="email address" />
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents="none"
                                color="gray.300"
                                children={<Lock size={20} color="gray" />}
                            />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText textAlign="right">
                            <Link>forgot password?</Link>
                        </FormHelperText>
                    </FormControl>
                    <Button borderRadius={10} type="submit" variant="solid" colorScheme="blue" width="full">
                        Login
                    </Button>
                </Stack>
            </CenterForm>
        </>
    )
}

export default Login
