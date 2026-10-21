import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "../../components/AppButton.jsx";
import { AppInput } from "../../components/AppInput.jsx";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../constants/theme";

import { validateRegister } from "../../utils/validators.js";
import { readRegisteredUsers, saveRegisteredUsers } from "../../utils/authStorage.mjs";

export let REGISTERED_USERS = [];

export async function syncRegisteredUsers() {
  REGISTERED_USERS = await readRegisteredUsers();
}

syncRegisteredUsers();

export default function RegisterScreen() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};

    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "At least 6 characters";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match";
    if (!agreed) next.terms = "Please accept the Terms to continue";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    const liveUsers = await readRegisteredUsers();
    REGISTERED_USERS = liveUsers;

    const check = validateRegister(
      form.email,
      form.password,
      form.confirmPassword,
      REGISTERED_USERS
    );

    if (!check.valid) {
      Alert.alert("Validation", check.message);
      return;
    }

    if (!validate()) return;

    setLoading(true);

    const nextUsers = [
      ...REGISTERED_USERS,
      {
        email: form.email.trim(),
        password: form.password,
      },
    ];

    const saved = await saveRegisteredUsers(nextUsers);

    if (!saved) {
      setLoading(false);
      Alert.alert("Error", "Could not save your account. Please try again.");
      return;
    }

    REGISTERED_USERS = nextUsers;

    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Account created! Please log in.", [
        {
          text: "OK",
          onPress: () => router.replace("/auth/login"),
        },
      ]);
    }, 1200);
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="medkit-outline" size={28} color={colors.white} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Book and manage your dental visits with ease
            </Text>
          </View>

          <AppInput
            label="First Name"
            placeholder="Juan Dela Cruz"
            value={form.firstName}
            onChangeText={update("firstName")}
            error={errors.firstName}
          />

          <AppInput
            label="Last Name"
            placeholder="Dela Cruz"
            value={form.lastName}
            onChangeText={update("lastName")}
            error={errors.lastName}
          />

          <AppInput
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={update("email")}
            error={errors.email}
          />

          <AppInput
            label="Phone Number"
            placeholder="09XX XXX XXXX"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={update("phone")}
            error={errors.phone}
          />

          <AppInput
            label="Password"
            placeholder="At least 6 characters"
            secureTextEntry
            value={form.password}
            onChangeText={update("password")}
            error={errors.password}
          />

          <AppInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={update("confirmPassword")}
            error={errors.confirmPassword}
          />

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreed((prev) => !prev)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: spacing.md }}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm - 2,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    ...typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "600",
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: 28,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.textMuted,
  },
  footerLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
  },
});
