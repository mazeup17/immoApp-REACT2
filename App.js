import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Nav from "./components/navigation/Nav";
import { UserProvider } from "./utils/context";
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <UserProvider>
      <Nav />
    </UserProvider>
  );
}
