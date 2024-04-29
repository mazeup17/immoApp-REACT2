import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { s } from "./Piece.style";

export function Piece({ route }) {
  const { appartementId } = route.params;
  const [pieceLogement, setPieceLogement] = useState([]);
  const [pieceIndex, setPieceIndex] = useState(0);
  const [equipements, setEquipements] = useState([]);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const [currentPieceLibelle, setCurrentPieceLibelle] = useState(null);
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
          setCurrentPieceLibelle(data[0].libelle);
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

  console.log(pieceLogement);

  const handleConfirmation = async () => {
    const dataComments = Object.entries(comments).map(([id, commentaire]) => ({
      id: parseInt(id),
      commentaire,
      rating: ratings[id] || 0,
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

  const handleEquipement = (pieceId, pieceLibelle) => {
    navigation.navigate({
      name: "Equipement",
      params: {
        pieceLibelle: pieceLibelle,
        pieceId: pieceId,
      },
    });
  };

  if (pieceLogement.length > 0) {
    return (
      <View>
        {pieceLogement.map((piece) => {
          return (
            <View>
              <Card
                style={s.cardContainer}
                onPress={() => handleEquipement(piece.id, piece.libelle)}
                key={piece.id}
              >
                <Card.Title
                  title={piece.libelle}
                  subtitle={`Nombre d'équipements: ${equipements.length}`} // Utilisation du nombre d'équipements filtrés
                />
              </Card>
            </View>
          );
        })}
        <Button title="Confirmer" onPress={handleConfirmation} />
      </View>
    );
  }
}

export default Piece;
