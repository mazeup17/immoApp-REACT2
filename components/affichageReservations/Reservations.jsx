import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, ActivityIndicator } from "react-native-paper";
import { UserContext } from "../../utils/context/index.js";
import { s } from "./Reservations.style.js";
import { useNavigation } from "@react-navigation/native";

function Affichage() {
  const [appartementProprio, setAppartementProprio] = useState([]);
  const [donneeReservation, setDonneeReservation] = useState([]);
  const [imageURL, setImageURL] = useState({});
  const { userId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://31.207.34.99/immoApi/reservation.php?id_utilisateur2=${userId}`
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

        const imageURLs = {};
        let reservationData = {};
        await Promise.all(
          Object.values(data).map(async (appartement) => {
            const photoResponse = await fetch(
              `http://31.207.34.99/immoApi/photo.php?id_appartement=${appartement.id_logement}`
            );

            const donneResponse = await fetch(
              `http://31.207.34.99/immoApi/logement.php?idLogement=${appartement.id_logement}`
            );

            if (photoResponse.ok && donneResponse.ok) {
              const photoData = await photoResponse.json();
              const donneData = await donneResponse.json();
              reservationData[appartement.id_logement] = donneData;
              imageURLs[appartement.id_logement] = photoData[0].photo;
            }
          })
        );
        setDonneeReservation(reservationData);
        setImageURL(imageURLs);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <View style={s.container}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (appartementProprio.error != null) {
    return (
      <View style={s.container}>
        <Text>Vous n'avez aucune réservation !</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.body}>
      {appartementProprio.map((appartement) => (
        <Card style={s.cardContainer} key={appartement.id}>
          <Card.Cover
            style={s.cardCover}
            source={{ uri: imageURL[appartement.id_logement] }}
          />
          <Card.Title
            title={donneeReservation[appartement.id_logement][0].libelle}
            subtitle={`${
              donneeReservation[appartement.id_logement][0].ville
            }, ${donneeReservation[appartement.id_logement][0].cp}`}
          />
          <Card.Content style={s.cardContent}>
            <Text>{appartement.prix}€</Text>
            <Text>{appartement.dateDebut}</Text>
            <Text>{appartement.dateFin}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

export default Affichage;
