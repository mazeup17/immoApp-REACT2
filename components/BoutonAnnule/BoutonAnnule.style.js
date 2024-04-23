import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const s = StyleSheet.create({
  button: {
    height: Dimensions.get("window").height * 0.1,
    alignSelf: "center",
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 30,
    width: 250,
  },
  text: {
    fontSize: Dimensions.get("window").width * 0.05,
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
  },
});

export { s };
