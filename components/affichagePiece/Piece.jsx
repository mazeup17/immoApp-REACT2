import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
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
  const [moyennes, setMoyennes] = useState([]);
  const [showBox, setShowBox] = useState(true);

  const confirmDialog = () => {
    return Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de confirmer la fin de votre état des lieux ?",
      [
        {
          text: "Confirmer",
          onPress: async () => {
            await handleConfirmation();
            setShowBox(false);
          },
        },
        {
          text: "Annuler",
        },
      ]
    );
  };

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
            `http://31.207.34.99/immoApi/equipement.php?id_appartement=${piece.id_logement}`
          );
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des équipements");
          }
          const data = await response.json();

          setEquipements(data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchEquipements();
  }, [pieceIndex, pieceLogement]);

  const handleConfirmation = async () => {
    try {
      const id_equipements = equipements.map((equip) => ({
        id_equipement: equip.id,
      }));
      const id_pieces = pieceLogement.map((piece) => ({ id_piece: piece.id }));

      const response = await fetch(
        `http://31.207.34.99/immoApi/evaluationEquipement.php?id_equipements=${JSON.stringify(
          id_equipements
        )}&id_pieces=${JSON.stringify(
          id_pieces
        )}&id_appartement=${appartementId}`
      );

      const responseText = await response.text(); // Lire la réponse en texte brut
      console.log("Réponse brute:", responseText); // Afficher la réponse brute

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des moyennes: ${responseText}`
        );
      }

      const data = JSON.parse(responseText); // Parser la réponse après vérification
      setMoyennes(data);
      console.log(id_equipements);
      console.log(data);
    } catch (error) {
      console.error("Erreur:", error);
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

  const getMoyenneForPiece = (pieceId) => {
    const moyenne = moyennes.find((m) => m.id_piece === pieceId);
    return moyenne ? parseFloat(moyenne.moyenne_etoiles).toFixed(1) : "N/A";
  };

  if (pieceLogement.length > 0) {
    return (
      <View>
        {pieceLogement.map((piece) => {
          return (
            <View key={piece.id}>
              <Card
                style={s.cardContainer}
                onPress={() => handleEquipement(piece.id, piece.libelle)}
              >
                <Card.Title
                  title={piece.libelle}
                  subtitle={`Moyenne Étoiles: ${getMoyenneForPiece(piece.id)}`}
                />
              </Card>
            </View>
          );
        })}
        <Button title="Confirmer" onPress={confirmDialog} />
      </View>
    );
  }

  return <View />;
}

export default Piece;
