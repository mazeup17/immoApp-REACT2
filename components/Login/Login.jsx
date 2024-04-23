import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ButtonConnexion } from "../ButtonConnexion/ButtonConnexion";
import { InputUser } from "../InputLogin/InputUser";
import { InputPassword } from "../InputLogin/InputPassword";
import { useContext, useState } from "react";
import { UserContext } from "../../utils/context";
import { useEffect } from "react";

export function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState();

  const { userRole } = useContext(UserContext);
  const { userId } = useContext(UserContext);
  const { setUserEmail } = useContext(UserContext);
  const { setUserId } = useContext(UserContext);
  const { setUserRole } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = {
      email: email,
      password: password,
    };

    //console.log(email);
    //console.log(password);

    try {
      const response = await fetch(
        "http://31.207.34.99/immoApi/utilisateurs.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        console.log("La requête n'a pas abouti :", response.status);
        setErreur("Mauvais identifiant !");
        return;
      }

      // Authentification réussie
      const data = await response.json();
      setUserEmail(email);
      setUserId(data.id);
      setUserRole(data.role);

      console.log(data); // Afficher le message de réussite d'authentification
    } catch (error) {
      console.error("Erreur lors de la requête fetch :", error);
    }
  };

  useEffect(() => {
    if (userId && userRole) {
      navigation.navigate("Réservation");
    }
  }, [userRole, userId, navigation]);

  if (erreur) {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.titre}>Bienvenue sur immoApp !</Text>
          <Text style={styles.erreur}>Mauvais identifiant !</Text>
          <InputUser onChangeEmail={setEmail} />
          <InputPassword onChangePassword={setPassword} />
          <View>
            <ButtonConnexion onPress={handleSubmit} />
          </View>
          <StatusBar style="auto" />
        </View>
      </>
    );
  } else {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.titre}>Bienvenue sur immoApp !</Text>
          <InputUser onChangeEmail={setEmail} />
          <InputPassword onChangePassword={setPassword} />
          <View>
            <ButtonConnexion onPress={handleSubmit} />
          </View>
          <StatusBar style="auto" />
        </View>
      </>
    );
  }
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#001F3F",
  },

  erreur: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FF0000",
  },
});
