import { useField } from '@unform/core';
import { TextInputProps } from 'react-native';
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  RefForwardingComponent,
  useState,
  useCallback,
} from 'react';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

type InputWithRef = RefForwardingComponent<InputRef, InputProps>;

const Input: InputWithRef = ({ name, icon, ...props }, ref) => {
  const inputElementRef = useRef<any>(null);
  const { registerField, defaultValue = '', error, fieldName } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilleded] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilleded(!!inputValueRef.current?.value.trim());
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      path: 'value',
      name: fieldName,
      ref: inputValueRef.current,
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputElementRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} hasError={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        {...props}
        ref={inputElementRef}
        onBlur={handleInputBlur}
        keyboardAppearance="dark"
        onFocus={handleInputFocus}
        defaultValue={defaultValue}
        placeholderTextColor="#666360"
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
      />
    </Container>
  );
};

export default forwardRef(Input);
