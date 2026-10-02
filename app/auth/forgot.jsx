import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "../../components/AppButton.jsx";
import { AppInput } from "../../components/AppInput.jsx";

import {
  colors,
  spacing,
  typography,
} from "../../constants/theme";

import { readRegisteredUsers, updateUserPassword } from "../../utils/authStorage.mjs";
import { validateForgot, validateResetPassword } from "../../utils/validators.js";

export default function ForgotScreen() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phase, setPhase] = useState("lookup");
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    const liveUsers = await readRegisteredUsers();
    const check = validateForgot(email, liveUsers);

    if (!check.valid) {
      Alert.alert("Check", check.message);
      return;
    }

    setPhase("reset");
    Alert.alert("Account found", "Set a new password for this account.");
  };

  const handleReset = async () => {
    const liveUsers = await readRegisteredUsers();
    const check = validateResetPassword(
      email,
      newPassword,
      confirmPassword,
      liveUsers
    );

    if (!check.valid) {
      Alert.alert("Reset Password", check.message);
      return;
    }

    setLoading(true);
    const updated = await updateUserPassword(email.trim(), newPassword);
    setLoading(false);

    if (!updated) {
      Alert.alert("Reset Password", "Could not update the password. Please try again.");
      return;
    }

    Alert.alert("Password updated", "Your password has been changed. Please log in again.", [
      {
        text: "OK",
        onPress: () => router.replace("/auth/login"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={colors.secondary} />
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        {phase === "lookup"
          ? "Enter the email linked to your account to continue."
          : "Choose a new password for your account."}
      </Text>

      <AppInput
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ marginTop: spacing.lg }}
      />

      {phase === "reset" && (
        <>
          <AppInput
            placeholder="New password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={{ marginTop: spacing.sm }}
          />

          <AppInput
            placeholder="Confirm new password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </>
      )}

      <AppButton
        title={
          phase === "lookup"
            ? "Continue"
            : loading
            ? "Updating..."
            : "Update Password"
        }
        onPress={phase === "lookup" ? handleLookup : handleReset}
        loading={loading}
        disabled={!email.trim() || (phase === "reset" && !newPassword.trim())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.background,
  },
  back: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
});
