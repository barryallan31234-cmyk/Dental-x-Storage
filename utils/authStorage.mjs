export const AUTH_STORAGE_KEY = "bisaya_registered_users";

export async function getStorageAdapter() {
  try {
    const mod = await import("@react-native-async-storage/async-storage");
    return mod.default || mod;
  } catch (error) {
    return null;
  }
}

export async function readRegisteredUsers(storage = null) {
  const adapter = storage || (await getStorageAdapter());

  if (!adapter) {
    return [];
  }

  try {
    const raw = await adapter.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (user) => user && typeof user.email === "string" && typeof user.password === "string"
    );
  } catch (error) {
    return [];
  }
}

export async function saveRegisteredUsers(users, storage = null) {
  const adapter = storage || (await getStorageAdapter());

  if (!adapter) {
    return false;
  }

  try {
    await adapter.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    return false;
  }
}

export async function updateUserPassword(email, newPassword, storage = null) {
  const adapter = storage || (await getStorageAdapter());

  if (!adapter) {
    return false;
  }

  try {
    const users = await readRegisteredUsers(adapter);
    const nextUsers = users.map((user) =>
      user.email.trim().toLowerCase() === String(email).trim().toLowerCase()
        ? { ...user, password: newPassword }
        : user
    );

    await adapter.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUsers));
    return true;
  } catch (error) {
    return false;
  }
}
