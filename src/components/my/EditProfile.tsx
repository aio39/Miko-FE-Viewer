import { SmallCloseIcon } from '@chakra-ui/icons';
import { Avatar, AvatarBadge, Button, Center, Flex, FormControl, FormErrorMessage, FormLabel, Heading, IconButton, Input, Stack } from '@chakra-ui/react';
import { IMAGE_DOMAIN, LARAVEL_URL } from '@src/const';
import { axiosI } from '@src/state/fetcher';
import { useUser } from '@src/state/swr';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const EditProfile = () => {
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string; email: string; password: string; avatar: string }>({ mode: 'all' });

  const { data: userData } = useUser();
  const router = useRouter();

  if (!userData) {
    router.push('/login');
    return <></>;
  }

  const [avatar, setAvatar] = useState(userData.avatar ?? null);
  const [email, setEmail] = useState(userData.email);
  const [name, setName] = useState(userData.name);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('name', name);
    formData.append('email', email);
    if (avatar !== null) {
      formData.append('avatar', avatar);
    }

    // console.log('submit');
    // console.log(data);
    axiosI
      .post(LARAVEL_URL + `/users/${userData.id}`, formData)
      .then(response => {
        console.log(response);
        router.push('/');
      })
      .catch((e: AxiosError) => {
        console.error('error in edit', e.message);
      });
  };

  const [imageSrc, setImageSrc] = useState('');

  const saveFileImage = (e: any) => {
    setImageSrc(URL.createObjectURL(e.target.files[0]));
    setAvatar(e.target.files[0]);
  };

  const removeFileImage = (e: any) => {
    URL.revokeObjectURL(imageSrc);
    setImageSrc('');
    setAvatar(userData.avatar ?? null);
  };

  return (
    <Flex direction={{ base: 'column', md: 'row' }} justify={{ base: 'center', md: 'space-between' }} align={{ base: 'center', md: 'end' }} ml={{ base: 0, sm: '10' }} px={10}>
      <Stack spacing={4} w={'full'}>
        <Heading pb={4} fontSize={{ base: '2xl', sm: '4xl' }}>
          User Profile Edit
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="avatar" py={4}>
            <FormLabel>Avatar</FormLabel>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="2xl" src={imageSrc ? imageSrc : IMAGE_DOMAIN + avatar}>
                  <AvatarBadge
                    onClick={removeFileImage}
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                  />
                </Avatar>
              </Center>
              <Center w="full">
                <Input onChange={saveFileImage} type="file" id="avatar" />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="name" py={4} isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              type="text"
              id="name"
              {...register('name', {
                required: 'This is required',
                minLength: {
                  value: 2,
                  message: 'Minimum length should be 2',
                },
              })}
              onChange={e => setName(e.target.value)}
            />
            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
          </FormControl>
          <FormControl id="email" py={4} isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              value={email}
              type="email"
              id="email"
              {...register('email', {
                required: 'This is required',
                minLength: {
                  value: 4,
                  message: 'Minimum length should be 4',
                },
              })}
              onChange={e => setEmail(e.target.value)}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>
          <Button
            my={4}
            bg={'cyan.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'cyan.500',
            }}
            type="submit"
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Stack>

      {/* <Image mb={10} display={{ base: 'none', md: 'center' }} minW="40vh" maxW="55vh" src="logo/mikoOtakon/color=simple.svg" opacity="30%" alt="miko-loco" /> */}
    </Flex>
  );
};

export default EditProfile;
