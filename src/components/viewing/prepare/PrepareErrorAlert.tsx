import { Alert, AlertIcon } from '@chakra-ui/react';
import { FC } from 'react';

const PrepareErrorAlert: FC<{ errorText: string | undefined }> = ({ errorText }) => {
  if (!errorText) return <></>;

  return (
    <Alert status="error">
      <AlertIcon />
      {errorText}
    </Alert>
  );
};

export default PrepareErrorAlert;
