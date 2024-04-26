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

export function Piece({ route }) {
  const { appartementId } = route.params;
  const [pieceLogement, setPieceLogement] = useState([]);
  const [pieceIndex, setPieceIndex] = useState(0);
  const [equipements, setEquipements] = useState([]);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const [currentPieceId, setCurrentPieceId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPieceLogement = async () => {
      try {
        const response = await fetch(
          `http://31.207.34.99/immoApi/piece.php?idLogement=${appartementId}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des pièces");
        }
        const data = await response.json();
        setPieceLogement(data);
        if (data.length > 0) {
          setCurrentPieceId(data[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPieceLogement();
  }, [appartementId]);

  useEffect(() => {
    const fetchEquipements = async () => {
      if (pieceLogement.length > 0) {
        const piece = pieceLogement[pieceIndex];
        try {
          const response = await fetch(
            `http://31.207.34.99/immoApi/equipement.php?id_appartement=${piece.id}`
          );
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des équipements");
          }
          const data = await response.json();

          const filteredEquipements = data.filter(
            (equipement) => equipement.id_piece === piece.id
          );

          setEquipements(filteredEquipements);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchEquipements();
  }, [pieceIndex, pieceLogement]);

  const handlePhoto = async () => {
    navigation.navigate("OpenCamera");
  };

  const handleNext = () => {
    setPieceIndex((prevIndex) =>
      prevIndex === pieceLogement.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setPieceIndex((prevIndex) =>
      prevIndex === 0 ? pieceLogement.length - 1 : prevIndex - 1
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
    try {
      const response = await fetch(
        "http://31.207.34.99/immoApi/evaluationPiece.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(allData),
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi des données");
      }
      console.log("etoile bien effectué");
    } catch (error) {
      console.error(error);
      console.log("Erreur lors de l'envoi des données");
    }
  };

  return (
    <View>
      {pieceLogement.length > 0 && (
        <View>
          <Text>Nom de la pièce : {pieceLogement[pieceIndex].libelle}</Text>
          {equipements.length > 0 && (
            <View>
              <Text>Équipements :</Text>
              {equipements.map((equipement, index) => (
                <View key={index}>
                  <Text>{equipement.libelle}</Text>
                  <TextInput
                    placeholder="Ajouter un commentaire"
                    value={comments[equipement.id] || ""}
                    onChangeText={(text) =>
                      handleCommentChange(equipement.id, text)
                    }
                  />
                  <TouchableOpacity onPress={() => handlePhoto()}>
                    <Text>Prendre une photo (pas obligatoire)</Text>
                  </TouchableOpacity>
                  <View style={{ width: 200, height: 200 }}>
                    <Image
                      style={{
                        flex: 1,
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
                          ratings[equipement.id] >= value ? "star" : "star-o"
                        }
                        size={24}
                        color={
                          ratings[equipement.id] >= value ? "gold" : "gray"
                        }
                        onPress={() => handleRatingChange(equipement.id, value)}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      <Button title="Précédent" onPress={handlePrev} />
      <Button title="Suivant" onPress={handleNext} />
      <Button title="Confirmer" onPress={handleConfirmation} />
    </View>
  );
}

export default Piece;
