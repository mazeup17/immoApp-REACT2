import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Card } from "react-native-paper";
import { UserContext } from "../../utils/context/index.js";
import { s } from "./Affichage.style.js";

function Affichage() {
  const [appartementProprio, setAppartementProprio] = useState([]);
  const [imageURL, setImageURL] = useState({});
  const { userId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://31.207.34.99/immoApi/reservation.php?id_utilisateur=${userId}`
        );
        if (userId) {
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des données");
          }
        }

        const data = await response.json();
        if (data) {
          setAppartementProprio(data);
        }
        console.log(data);
        const imageURLs = {};
        await Promise.all(
          Object.values(data).map(async (appartement) => {
            const photoResponse = await fetch(
              `http://31.207.34.99/immoApi/photo.php?id_appartement=${appartement.id_logement}`
            );
            if (!photoResponse.ok) {
              console.error(
                "Erreur lors du chargement des photos",
                photoResponse.status
              );
            } else {
              const photoData = await photoResponse.json();
              imageURLs[appartement.id_logement] = photoData[0].photo;
            }
          })
        );
        setImageURL(imageURLs);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <View style={s.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={s.body}>
      <ScrollView contentContainerStyle={s.scrollView}>
        {appartementProprio.map((appartement, index) => (
          <TouchableOpacity
            activeOpacity={1}
            key={appartement.id}
            onPress={() => {}}
          >
            <Card style={s.cardContainer}>
              <Card.Cover
                style={s.cardCover}
                source={{ uri: imageURL[appartement.id_logement] }}
              />
              <Card.Content>
                <Text>ID : {appartement.id}</Text>
                <Text>Utilisateur : {appartement.id_utilisateur}</Text>
                <Text>ID Appartement : {appartement.id_logement}</Text>
                <Text>Prix : {appartement.prix}</Text>
                <Text>Date de début : {appartement.dateDebut}</Text>
                <Text>Date de fin : {appartement.dateFin}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default Affichage;
