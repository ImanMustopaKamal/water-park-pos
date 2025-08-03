import React, { createContext, useContext, useState } from "react";
import { Snackbar, Text } from "react-native-paper";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SnackbarType = "success" | "error" | "warning" | "info";

interface SnackbarContextProps {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
  showSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("info");
  const [duration, setDuration] = useState(3000);

  const showSnackbar = (
    msg: string,
    type: SnackbarType = "info",
    dur = 3000
  ) => {
    setMessage(msg);
    setType(type);
    setDuration(dur);
    setVisible(true);
  };

  const onDismiss = () => setVisible(false);

  const getColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "warning":
        return "#FF9800";
      case "info":
      default:
        return "#2196F3";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "alert";
      case "info":
      default:
        return "information";
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={duration}
        style={{
          backgroundColor: getColor(),
          marginHorizontal: 16,
          width: "40%",
          alignSelf: "flex-end",
          borderRadius: 8,
          minHeight: 50,
          justifyContent: "center",
        }}
        wrapperStyle={{
          bottom: 30, // Naik sedikit dari bawah
        }}
        contentStyle={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={getIcon()}
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: "#fff" }}>{message}</Text>
        </View>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
