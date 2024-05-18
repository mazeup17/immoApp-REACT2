import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
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
      const id_equipements = equipements.map(equip => ({ id_equipement: equip.id }));
      const id_pieces = pieceLogement.map(piece => ({ id_piece: piece.id }));

      const response = await fetch(`http://31.207.34.99/immoApi/evaluationEquipement.php?id_equipements=${JSON.stringify(id_equipements)}&id_pieces=${JSON.stringify(id_pieces)}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des moyennes");
      }

      const data = await response.json();
      setMoyennes(data);
      console.log(id_equipements);

      console.log(data);
    } catch (error) {
      console.error(error);
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
    const moyenne = moyennes.find(m => m.id_piece === pieceId);
    return moyenne ? moyenne.moyenne_etoiles : 'N/A';
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
                  subtitle={`Nombre d'équipements: ${equipements.length}`} // Utilisation du nombre d'équipements filtrés
                />
                <Card.Content>
                  <Text>{`Moyenne Étoiles: ${getMoyenneForPiece(piece.id)}`}</Text>
                </Card.Content>
              </Card>
            </View>
          );
        })}
        <Button title="Confirmer" onPress={handleConfirmation} />
      </View>
    );
  }

  return <View />;
}


export default Piece;
