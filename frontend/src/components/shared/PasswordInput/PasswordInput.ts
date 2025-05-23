import { PasswordInput } from '@mantine/core';


const ExtendedPasswordInput = PasswordInput.extend({
   defaultProps: {
      radius: 'md',
      size: 'md',
   },
});

export default ExtendedPasswordInput;
