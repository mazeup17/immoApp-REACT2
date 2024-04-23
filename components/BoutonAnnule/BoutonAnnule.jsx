import { Text, TouchableOpacity } from "react-native";
import { s } from "./BoutonAnnule.style.js";
export function ButtonConvert({ onPress, unit }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.button}>
      <Text style={s.text}>Annuler une réservation {unit}</Text>
    </TouchableOpacity>
  );
}
