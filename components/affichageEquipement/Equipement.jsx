import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function Equipement({ route }) {
  const { pieceLibelle, pieceId, reservationId } = route.params;
  const [equipementIndex, setEquipementsIndex] = useState(0);
  const [equipements, setEquipements] = useState([]);
  const [equipementPhotos, setEquipementPhotos] = useState({});
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        const response = await fetch(
          `http://31.207.34.99/immoApi/equipement.php?id_appartement=${pieceId}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des équipements");
        }
        const data = await response.json();

        const filteredEquipements = data.filter(
          (equipement) => equipement.id_piece === pieceId
        );

        setEquipements(filteredEquipements);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEquipements();
  }, [pieceId]);

  const confirmDialog = () => {
    return Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de confirmer la fin de votre état des lieux pour cette pièce ?",
      [
        {
          text: "Annuler",
        },
        {
          text: "Confirmer",
          onPress: async () => {
            await handleConfirmation();
            setShowBox(false);
          },
        },
      ]
    );
  };

  const handlePhoto = (equipementId) => {
    navigation.navigate("OpenCamera", {
      routeName: "Equipement",
      equipementId,
      equipementPhotos,
      setEquipementPhotos,
    });
  };

  const handleNext = () => {
    setEquipementsIndex((prevIndex) =>
      prevIndex === equipements.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setEquipementsIndex((prevIndex) =>
      prevIndex === 0 ? equipements.length - 1 : prevIndex - 1
    );
  };

  const handleCommentChange = (equipementId, comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [equipementId]: comment,
    }));
  };

  const handleRatingChange = (equipementId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [equipementId]: rating,
    }));
  };

  const handleConfirmation = async () => {
    console.log(comments); // Vérifiez les commentaires actuels
    const dataComments = Object.entries(comments).map(([id, commentaire]) => {
      /*console.log("ID:", id); // Vérifiez l'ID de l'équipement
      console.log("Commentaire:", commentaire); // Vérifiez le commentaire associé à l'équipement
      console.log("Rating:", ratings[id] || 0);
      console.log("Photo :", equipementPhotos[id] || null);*/
      console.log("Piece id :", pieceId);

      return {
        id: parseInt(id),
        id_piece: pieceId,
        commentaire,
        rating: ratings[id] || 0,
        photo: equipementPhotos[id] || null,
        id_reservation: reservationId,
      };
    });

    try {
      console.log(dataComments);
      const response = await fetch(
        "http://31.207.34.99/immoApi/evaluationEquipement.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataComments),
        }
      );

      if (!response.ok) {
        console.log("La requête n'a pas abouti :", response.status);
        Alert.alert(
          "Il y a eu une erreur lors de la transimission des données"
        );
      } else {
        navigation.goBack();
        // Authentification réussie
        const data = await response.json();
        console.log(data); // Afficher le message de réussite d'authentification
      }
    } catch (error) {
      console.error("Erreur lors de la requête fetch :", error);
    }
  };

  useEffect(() => {
    if (pieceLibelle) {
      navigation.setOptions({
        title: pieceLibelle,
      });
    }
  }, [pieceLibelle, navigation]);

  return (
    <View>
      <View>
        {equipements.length > 0 && (
          <View>
            <Text>Équipements :</Text>
            <View>
              <Text>{equipements[equipementIndex].libelle}</Text>
              <TextInput
                placeholder="Ajouter un commentaire"
                value={comments[equipements[equipementIndex].id] || ""}
                onChangeText={(text) =>
                  handleCommentChange(equipements[equipementIndex].id, text)
                }
              />
              <TouchableOpacity
                onPress={() => handlePhoto(equipements[equipementIndex].id)}
              >
                <Text>Ajouter une photo (pas obligatoire)</Text>
              </TouchableOpacity>
              <View>
                {equipementPhotos[equipements[equipementIndex].id] && (
                  <Image
                    style={{
                      width: 200,
                      height: 200,
                      resizeMode: "contain",
                    }}
                    source={{
                      uri: `data:image/jpg;base64,${
                        equipementPhotos[equipements[equipementIndex].id]
                      }`,
                    }}
                  />
                )}
              </View>
              <View style={{ flexDirection: "row" }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <FontAwesome
                    key={value}
                    name={
                      ratings[equipements[equipementIndex].id] >= value
                        ? "star"
                        : "star-o"
                    }
                    size={24}
                    color={
                      ratings[equipements[equipementIndex].id] >= value
                        ? "gold"
                        : "gray"
                    }
                    onPress={() =>
                      handleRatingChange(equipements[equipementIndex].id, value)
                    }
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
      {equipements.length > 1 && (
        <View>
          {equipementIndex > 0 && (
            <Button title="Précédent" onPress={handlePrev} />
          )}
          {equipementIndex < equipements.length - 1 && (
            <Button title="Suivant" onPress={handleNext} />
          )}
        </View>
      )}
      {equipementIndex === equipements.length - 1 && (
        <Button title="Confirmer" onPress={confirmDialog} />
      )}
    </View>
  );
}

export default Equipement;
