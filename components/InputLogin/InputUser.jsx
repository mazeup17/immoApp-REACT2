import { TextInput, View } from "react-native";
import { s } from "./InputUser.style";
import { useState } from "react";

export function InputUser({ onChangeEmail }) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <View style={s.container}>
      <TextInput
        style={[s.input, isFocused ? s.inputHover : null]}
        placeholder="Veuillez entrer votre email"
        inputMode="email"
        autoComplete="off"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={onChangeEmail}
      />
    </View>
  );
}
