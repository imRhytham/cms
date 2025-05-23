import { createTheme, } from '@mantine/core';


import { mantineColorsPalette } from './color';
import ExtendedTextInput from '@/components/shared/TextInput/TextInput';
import ExtendedTextarea from '@/components/shared/Textarea/Textarea';
import ExtendedPasswordInput from '@/components/shared/PasswordInput/PasswordInput';

const theme = createTheme({
   colors: mantineColorsPalette,
   primaryColor: 'primary',
   fontFamily: "Inter, sans-serif",
   components: {
      TextInput: ExtendedTextInput,
      Textarea: ExtendedTextarea,
      PasswordInput: ExtendedPasswordInput
   }
});

export default theme;   