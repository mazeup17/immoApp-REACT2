import { Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

export function ButtonLogout({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.button}>
      <Text style={s.text}>Se déconnecter</Text>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  button: {
    backgroundColor: "#001F3F",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 15,
    width: 150,
  },
  text: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
  },
});
