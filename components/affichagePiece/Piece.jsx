import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export function Piece({ route }) {
  const { appartementId } = route.params;
  const [pieceLogement, setPieceLogement] = useState([]);
  const [pieceIndex, setPieceIndex] = useState(0);
  const [equipements, setEquipements] = useState([]);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchPieceLogement = async () => {
      try {
        const reponse = await fetch(
          `http://31.207.34.99/immoApi/piece.php?idLogement=${appartementId}`
        );
        if (!reponse.ok) {
          throw new Error("Erreur lors de la récupération des pièces");
        }
        const data = await reponse.json();
        setPieceLogement(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPieceLogement();
  }, []);

  useEffect(() => {
    const fetchEquipements = async () => {
      if (pieceLogement.length > 0) {
        const piece = pieceLogement[pieceIndex];
        try {
          const equipementsReponse = await fetch(
            `http://31.207.34.99/immoApi/equipement.php?id_appartement=${piece.id}`
          );
          if (!equipementsReponse.ok) {
            throw new Error("Erreur lors de la récupération des équipements");
          }
          const equipementsData = await equipementsReponse.json();

          const filteredEquipements = equipementsData.filter(
            (equipement) => equipement.id_piece === piece.id
          );

          setEquipements(filteredEquipements);

          const initialComments = {};
          filteredEquipements.forEach((equipement) => {
            initialComments[equipement.id] = "";
          });
          setComments(initialComments);

          const initialRatings = {};
          filteredEquipements.forEach((equipement) => {
            initialRatings[equipement.id] = 0;
          });
          setRatings(initialRatings);

          /*
          const initialPhotos = {};
          filteredEquipements.forEach((equipement) => {
            initialPhotos[equipement.id] = null;
          });
          setPhotos(initialPhotos);*/
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchEquipements();
  }, [pieceIndex, pieceLogement]);

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

  const takePhoto = (equipementId) => {
    const options = {
      title: "Prendre une photo",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("Annulé");
      } else if (response.error) {
        console.log("Erreur : ", response.error);
      } else {
        console.log("Photo prise : ", response.uri);
        setPhotos((prevPhotos) => ({
          ...prevPhotos,
          [equipementId]: response.uri,
        }));
      }
    });
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
                    value={comments[equipement.id]}
                    onChangeText={(text) =>
                      handleCommentChange(equipement.id, text)
                    }
                  />
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
    </View>
  );
}

export default Piece;
