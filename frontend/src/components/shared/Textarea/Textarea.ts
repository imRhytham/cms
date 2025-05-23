import { Textarea } from '@mantine/core';


const ExtendedTextarea = Textarea.extend({
   defaultProps: {
      radius: 'md',
      size: 'md',
   },
});

export default ExtendedTextarea;
