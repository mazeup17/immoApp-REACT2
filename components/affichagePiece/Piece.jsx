import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

export function Piece({ route }) {
  if (!route.params) {
    return;
  }
  const { appartementId } = route.params;
  const [pieceLogement, setPieceLogement] = useState([]);
  const [pieceIndex, setPieceIndex] = useState(0);

  useEffect(() => {
    const fetchPieceLogement = async () => {
      try {
        const reponse = await fetch(
          `http://31.207.34.99/immoApi/piece.php?idLogement=${appartementId}`
        );
        if (!reponse.ok) {
          throw new Error("Erreur lors de la récupération des pieces");
        }
        const data = await reponse.json();
        console.log(data);
        setPieceLogement(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPieceLogement();
  }, []);

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

  return (
    <View>
      {pieceLogement.length > 0 && (
        <View>
          <Text>Nom de la pièce : {pieceLogement[pieceIndex].libelle}</Text>
          {/* Afficher les détails de la pièce */}
        </View>
      )}
      <Button title="Précédent" onPress={handlePrev} />
      <Button title="Suivant" onPress={handleNext} />
    </View>
  );
}

export default Piece;
