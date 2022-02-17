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
    FormLabel,
    FormErrorMessage
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Router from 'next/router'
import { Lock, UserCircle } from 'phosphor-react'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
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
                    console.log(err)
                    setError(err.field, { message: err.message })
                })
            }
            localStorage.setItem('token', res.accessToken)
            Router.push('/')
        }
    })
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting }
    } = useForm()

    const handleShowClick = () => setShowPassword(!showPassword)
    const mySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // do your early validation here
        console.log(errors)
        handleSubmit(values => {
            console.log(errors, isSubmitting, values)
            login({ variables: { userLoginOptions2: values } })
        })(e)
    }

    return (
        <>
            <CenterForm onSubmit={mySubmit}>
                <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
                    <FormControl isInvalid={errors.username}>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <UserCircle size={20} color="gray" />
                            </InputLeftElement>
                            <Input
                                id="username"
                                placeholder="name of the user"
                                {...register('username', {
                                    required: 'This is required',
                                    minLength: { value: 3, message: 'Minimum length should be 3' }
                                })}
                            />
                        </InputGroup>
                        <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.password}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none" color="gray.300">
                                <Lock size={20} color="gray" />
                            </InputLeftElement>

                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="*****"
                                {...register('password', {
                                    required: 'This is required',
                                    minLength: { value: 3, message: 'Minimum length should be 3' }
                                })}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                        <FormHelperText textAlign="right">
                            <Link>forgot password?</Link>
                        </FormHelperText>
                    </FormControl>
                    <Button
                        borderRadius={10}
                        type="submit"
                        isLoading={isSubmitting}
                        variant="solid"
                        colorScheme="blue"
                        width="full"
                    >
                        Login
                    </Button>
                </Stack>
            </CenterForm>
        </>
    )
}
export default Login
