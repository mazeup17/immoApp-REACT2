import React, { useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StyleSheet } from "react-native";
import { LogBox } from "react-native";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Alert,
} from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

export function OpenCamera({ route }) {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const { routeName, setEquipementPhotos, equipementId } = route.params;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [blobCapturedImage, setBlobCapturedImage] = useState(null);

  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);

  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const autorisation = async () => {
    if (!permission.granted) {
      navigation.goBack();
      Alert.alert(
        "Accès refusé, veuillez nous autoriser à accéder à la caméra dans vos paramètres"
      );
    }
  };

  autorisation();

  let camera = CameraView;

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
    setEquipementPhotos((prevPhotos) => ({
      ...prevPhotos,
      [equipementId]: blobCapturedImage,
    }));
    navigation.goBack();
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
        <CameraView
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
        </CameraView>
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
    marginTop: 30,
    marginLeft: 30,
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
