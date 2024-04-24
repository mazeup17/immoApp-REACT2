import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Login } from "../Login/Login";
import { useContext, useEffect } from "react";
import Logout from "../Logout/Logout";
import { UserContext } from "../../utils/context/index";
import Affichage from "../affichageClient/Affichage";
import Reservations from "../affichageReservations/Reservations";
import Piece from "../affichagePiece/Piece";
import { createStackNavigator } from "@react-navigation/stack";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function Nav() {
  const { userEmail } = useContext(UserContext);
  if (!userEmail) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  } else {
    return (
      <Drawer.Navigator initialRouteName="Réservation">
        <Drawer.Screen name="Réservation" component={Affichage} />
        <Drawer.Screen
          name="Toutes mes réservations"
          component={Reservations}
        />
        <Drawer.Screen name="Déconnexion" component={Logout} />
      </Drawer.Navigator>
    );
  }
}
