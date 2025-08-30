import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export const CustomTextInput = React.forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={props.placeholderTextColor || '#8E8E93'}
      ref={ref}
    />
  );
});

// 기본 TextInput을 CustomTextInput으로 export
export { CustomTextInput as TextInput };