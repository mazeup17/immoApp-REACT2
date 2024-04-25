import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import Piece from "./components/affichagePiece/Piece";
import Nav from "./components/navigation/Nav";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./utils/context";
import { OpenCamera } from "./components/Camera/OpenCamera";

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name=" "
            component={Nav}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Piece"
            component={Piece}
            options={{ title: "Etat des lieux" }}
          />
          <Stack.Screen
            name="OpenCamera"
            component={OpenCamera}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
