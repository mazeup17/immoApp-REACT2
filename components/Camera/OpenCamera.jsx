import React, { useRef } from "react";
import { Camera } from "expo-camera";
import { StyleSheet } from "react-native";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Alert,
} from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons"; // Importez les icônes d'une bibliothèque
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

export function OpenCamera() {
  const navigation = useNavigation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [blobCapturedImage, setBlobCapturedImage] = useState(null);
  StatusBar.setHidden(true);

  const autorisation = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status != "granted") {
      navigation.goBack();
      Alert.alert(
        "Accès refusé, veuillez nous autoriser à accéder à la caméra dans vos paramètres"
      );
    }
  };

  autorisation();

  let camera = Camera;

  const options = {
    quality: 0.1,
    base64: true,
  };

  const prendrePhoto = async () => {
    const photo = await camera.takePictureAsync(options);
    setPreviewVisible(true);
    setCapturedImage(photo);
    setBlobCapturedImage(photo.base64);
  };

  const reprendrePhoto = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    prendrePhoto();
  };

  const annulerPhoto = () => {
    navigation.goBack();
  };

  const validerPhoto = () => {
    navigation.navigate({
      name: "Piece",
      params: { photoEquipement: blobCapturedImage },
      merge: true,
    });
  };

  const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
    return (
      <View style={s.container}>
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
          }}
        >
          <View style={s.btnCancel}>
            <TouchableOpacity onPress={annulerPhoto}>
              <AntDesign name="close" size={36} color="white" />
            </TouchableOpacity>
          </View>
          <View style={s.previewContainer}>
            <TouchableOpacity style={s.test} onPress={retakePicture}>
              <AntDesign name="sync" size={36} color="white" />
              <Text style={s.text}>REPRENDRE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.test} onPress={savePhoto}>
              <AntDesign name="check" size={36} color="white" />
              <Text style={s.text}>SAUVEGARDER</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <>
      {previewVisible && blobCapturedImage && capturedImage ? (
        <CameraPreview
          photo={capturedImage}
          savePhoto={validerPhoto}
          retakePicture={reprendrePhoto}
        />
      ) : (
        <Camera
          style={{ flex: 1 }}
          ref={(r) => {
            camera = r;
          }}
        >
          <View style={s.container}>
            <View style={s.btnCancel}>
              <TouchableOpacity onPress={annulerPhoto}>
                <AntDesign name="close" size={36} color="white" />
              </TouchableOpacity>
            </View>
            <View style={s.cameraContainer}>
              <TouchableOpacity onPress={prendrePhoto} style={s.btnTakePhoto} />
            </View>
          </View>
        </Camera>
      )}
    </>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
    width: "100%",
  },
  previewContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 60,
    justifyContent: "space-between",
  },
  cameraContainer: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
    padding: 50,
  },
  btnCancel: {
    color: "#fff",
    alignItems: "flex-end",
    marginTop: 30,
    marginRight: 30,
  },
  btnTakePhoto: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginBottom: 25,
  },
  test: {
    alignItems: "center",
  },
  text: {
    color: "#fff",
    alignItems: "center",
    fontWeight: "bold",
  },
});
