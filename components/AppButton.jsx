import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../constants/theme";

export function AppButton({
  title,
  onPress,
  loading = false,
  variant = "primary",
  disabled = false,
  icon = null,
  style,
}) {
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === "danger"
      ? colors.danger
      : variant === "secondary"
      ? colors.white
      : variant === "outline"
      ? colors.white
      : colors.primary;

  const textColor =
    variant === "secondary" || variant === "outline"
      ? colors.primary
      : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        variant === "outline" && styles.outline,
        variant === "text" && styles.textButton,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.text, { color: textColor }, typography.button]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },

  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },

  textButton: {
    minHeight: "auto",
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.85,
  },

  disabled: {
    opacity: 0.5,
  },
});
