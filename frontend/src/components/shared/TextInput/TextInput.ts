import { TextInput } from '@mantine/core';


const ExtendedTextInput = TextInput.extend({
   defaultProps: {
      radius: 'md',
      size: 'md',
   },

});

export default ExtendedTextInput;
