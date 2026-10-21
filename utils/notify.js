import { Alert, Platform } from "react-native";

export function showAlert(title, message, buttons) {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;

  if (!buttons || buttons.length <= 1) {
    window.alert(text);
    if (buttons && buttons[0] && buttons[0].onPress) buttons[0].onPress();
    return;
  }

  const confirmed = window.confirm(text);
  const cancelButton = buttons.find((b) => b.style === "cancel");
  const actionButton = buttons.find((b) => b.style !== "cancel");

  if (confirmed) {
    if (actionButton && actionButton.onPress) actionButton.onPress();
  } else if (cancelButton && cancelButton.onPress) {
    cancelButton.onPress();
  }
}