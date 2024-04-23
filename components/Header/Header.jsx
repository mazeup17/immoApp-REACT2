import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Immo App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff", // Couleur de fond du header
    height: 60, // Hauteur du header
    justifyContent: "center", // Pour centrer verticalement le texte
    alignItems: "center", // Pour centrer horizontalement le texte
    borderBottomWidth: 1, // Pour ajouter une bordure en bas
    borderBottomColor: "#ccc", // Couleur de la bordure en bas
  },
  title: {
    fontSize: 20, // Taille de la police du texte
    fontWeight: "bold", // Police en gras
  },
});

export default Header;
