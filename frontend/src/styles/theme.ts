import { createTheme, } from '@mantine/core';


import { mantineColorsPalette } from './color';

const theme = createTheme({
   colors: mantineColorsPalette,
   primaryColor: 'primary',
   fontFamily: "Inter, sans-serif",
});

export default theme;   