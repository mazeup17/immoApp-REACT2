import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function Equipement({ route }) {
  const { pieceLibelle } = route.params;
  const { pieceId } = route.params;
  const [equipementIndex, setEquipementsIndex] = useState(0);
  const [equipements, setEquipements] = useState([]);
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
  });

  const handlePhoto = async () => {
    navigation.navigate("OpenCamera", { routeName: "Equipement" });
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
    const dataComments = Object.entries(comments).map(([id, commentaire]) => ({
      id: parseInt(id),
      commentaire,
      rating: ratings[id] || 0,
    }));

    const dataEtoiles = pieceLogement.map((piece) => ({
      pieceId: piece.id,
      commentaire: null,
      id: null,
      rating: null,
    }));

    const allData = [...dataComments, ...dataEtoiles];

    console.log(allData);
  };

  useEffect(() => {
    // Mettre à jour le titre de la page lorsque la pièce actuelle change
    if (pieceLibelle) {
      navigation.setOptions({
        title: pieceLibelle,
      });
    }
  }, [navigation]);

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
              <TouchableOpacity onPress={() => handlePhoto()}>
                <Text>Ajouter une photo (pas obligatoire)</Text>
              </TouchableOpacity>
              <View style={{}}>
                <Image
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: "contain",
                  }}
                  source={{
                    uri: `data:image/jpg;base64,${route.params?.photoEquipement}`,
                  }}
                />
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
      <Button title="Précédent" onPress={handlePrev} />
      <Button title="Suivant" onPress={handleNext} />
      <Button title="Confirmer" onPress={handleConfirmation} />
    </View>
  );
}

export default Equipement;
