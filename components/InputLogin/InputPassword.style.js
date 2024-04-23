import { StyleSheet } from "react-native";

const s = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 15,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#66B3FF",
    borderRadius: 20,
    height: 50,
    paddingLeft: 25,
  },
  inputHover: {
    borderColor: "#001F3F", // Changement de couleur lorsqu'il est survolé
  },
});

export { s };
