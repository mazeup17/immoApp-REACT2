import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Login } from "../Login/Login";
import { useContext, useEffect } from "react";
import Logout from "../Logout/Logout";
import { UserContext } from "../../utils/context/index";
import Affichage from "../affichageClient/Affichage";
import Piece from "../affichagePiece/Piece";

const Drawer = createDrawerNavigator();

export default function Nav() {
  const { userEmail } = useContext(UserContext);
  if (!userEmail) {
    return <Login />;
  } else {
    return (
      <Drawer.Navigator initialRouteName="Réservation">
        <Drawer.Screen name="Réservation" component={Affichage} />
        <Drawer.Screen name="Déconnexion" component={Logout} />
      </Drawer.Navigator>
    );
  }
}
