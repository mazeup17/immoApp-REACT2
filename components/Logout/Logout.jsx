import React, { useContext } from "react";
import { UserContext, UserProvider } from "../../utils/context";
import { ButtonLogout } from "./ButtonLogout";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Logout() {
  const { setUserEmail, setUserId, setUserRole } = useContext(UserContext);

  const handlelogout = () => {
    setUserEmail(null);
    setUserId(null);
    setUserRole(null);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titre}>
          Appuyer sur le bouton pour vous déconnecter
        </Text>
        <View>
          <ButtonLogout onPress={handlelogout} />
        </View>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  titre: {
    paddingBottom: 15,
    fontSize: 17,
    fontWeight: "bold",
    color: "#001F3F",
  },
});
