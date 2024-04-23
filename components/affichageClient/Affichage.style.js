import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const s = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height * 0.1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "90%", // Ajustez la largeur de votre carte selon vos besoins
    marginVertical: 10, // Ajoutez un espace vertical entre chaque carte
    alignSelf: "center",
  },
  card: {
    width: "80%",
    alignItems: "center", // Pour centrer le contenu de la carte horizontalement
    margin: "2%",
    backgroundColor: "black",
  },
  cardCover: {
    overflow: "hidden", // Masquer le contenu débordant
    borderBottomLeftRadius: 0, // Enlever l'arrondi en bas à gauche
    borderBottomRightRadius: 0, // Enlever l'arrondi en bas à droite
  },
  cardActions: {
    justifyContent: "center", // Pour centrer le contenu horizontalement
  },
  cardContent: {
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

export { s };
