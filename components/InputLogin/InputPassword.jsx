import { TextInput, View } from "react-native";
import { s } from "./InputPassword.style";
import { useState } from "react";

export function InputPassword({ onChangePassword }) {
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
        placeholder="Veuillez entrer votre mot de passe"
        inputMode="text"
        autoComplete="off"
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={true}
        onChangeText={onChangePassword}
      />
    </View>
  );
}
