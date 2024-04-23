import { Text, TouchableOpacity } from "react-native";
import { s } from "./ButtonConnexion.style";
export function ButtonConnexion({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.button}>
      <Text style={s.text}>Se connecter</Text>
    </TouchableOpacity>
  );
}
