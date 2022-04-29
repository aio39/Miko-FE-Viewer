import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { FcGoogle } from '@react-icons/all-files/fc/FcGoogle';
import AsyncBoundary from '@src/components/common/wrapper/AsyncBoundary';
import { LARAVEL_URL } from '@src/const';
import BasicLayout from '@src/layout/BasicLayout';
import { loginState } from '@src/state/recoil';
import { tryLogin, useUser } from '@src/state/swr';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

const RedirectLogic: FC = () => {
  const { data: userData, error: userError } = useUser();
  const router = useRouter();

  if (userData && !userError) {
    router.push('/'); // 로그인 상태면 홈으로 강제 이동동
  }
  return <></>;
};

export default function LoginPage() {
  const {
    handleSubmit,
    // control,
    // reset,
    // watch,
    // setValue,
    register,
    // getValues,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string }>({ mode: 'all' });
  const router = useRouter();
  const setLoginState = useSetRecoilState(loginState);

  const onSubmit = async (data: any) => {
    const result = await tryLogin(data);
    if (result) {
      setLoginState(true);
      setTimeout(() => {
        router.push('/');
      }, 0);
    }
  };

  return (
    <>
      <Head>
        <title>LOGIN | MIKO</title>
        <meta name="description" content="미코 로그인 페이지" />
      </Head>
      <AsyncBoundary pendingFallback={<></>}>
        <RedirectLogic />
      </AsyncBoundary>
      <Box my={20} rounded={'lg'} border="1px" borderColor="gray.200" borderRadius="15px" p={10} w={'full'} maxW={'md'}>
        <Heading fontSize={'4xl'} my={6}>
          Sign In
        </Heading>
        <Stack spacing={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'This is required',
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                  })}
                />
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'This is required',
                    minLength: {
                      value: 4,
                      message: 'Minimum length should be 4',
                    },
                  })}
                />
                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>
              <Stack spacing={6}>
                <Stack direction={{ base: 'column', sm: 'row' }} align={'start'} justify={'end'}>
                  <NextLink href="./user/password">
                    <Link color={'blue.400'}>Forgot password?</Link>
                  </NextLink>
                  <NextLink href="./login/sign">
                    <Link color={'blue.400'}>会員登録</Link>
                  </NextLink>
                </Stack>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Sign in
                </Button>
                <Button
                  w={'full'}
                  variant={'outline'}
                  _hover={{
                    bg: 'blue.300',
                    color: 'white',
                  }}
                  leftIcon={<FcGoogle />}
                  type="submit"
                  isLoading={isSubmitting}
                  onClick={() => {
                    router.push(`${LARAVEL_URL}/login/google`);
                  }}
                >
                  <Center>
                    <Text>Sign in with Google</Text>
                  </Center>
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Box>
    </>
  );
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <BasicLayout>{page}</BasicLayout>;
};
