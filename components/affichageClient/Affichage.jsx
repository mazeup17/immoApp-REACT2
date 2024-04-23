import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, ActivityIndicator } from "react-native-paper";
import { UserContext } from "../../utils/context/index.js";
import { s } from "./Affichage.style.js";

function Affichage() {
  const [appartementProprio, setAppartementProprio] = useState([]);
  const [donneeReservation, setDonneeReservation] = useState([]);
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
        const imageURLs = {};
        let reservationData = {};
        await Promise.all(
          Object.values(data).map(async (appartement) => {
            const photoResponse = await fetch(
              `http://31.207.34.99/immoApi/photo.php?id_appartement=${appartement.id_logement}`
            );

            const donneResponse = await fetch(
              `http://31.207.34.99/immoApi/logement.php?id=${appartement.id_logement}`
            );

            if (photoResponse.ok && donneResponse.ok) {
              const photoData = await photoResponse.json();
              const donneData = await donneResponse.json();
              reservationData = donneData;
              imageURLs[appartement.id_logement] = photoData[0].photo;
            }
          })
        );
        setDonneeReservation(reservationData);
        setImageURL(imageURLs);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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

  return (
    <View style={s.body}>
      {appartementProprio.map((appartement, index) => (
        <TouchableOpacity
          activeOpacity={1}
          key={appartement.id}
          onPress={() => {}}
        >
          <Card style={s.cardContainer} onPress={() => {}}>
            <Card.Cover
              style={s.cardCover}
              source={{ uri: imageURL[appartement.id_logement] }}
            />
            <Card.Title
              title={donneeReservation[0].libelle}
              subtitle={`${donneeReservation[0].ville}, ${donneeReservation[0].cp}`}
            />
            <Card.Content style={s.cardContent}>
              <Text>{appartement.prix}€</Text>
              <Text>{appartement.dateDebut}</Text>
              <Text>{appartement.dateFin}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Affichage;
