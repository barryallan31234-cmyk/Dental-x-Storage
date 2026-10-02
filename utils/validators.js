export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(trimmed);
};

export const isEmpty = (text) => {
  return !text || !text.trim();
};

export const minLength = (text, minChars) => {
  return text && text.length >= minChars;
};

export const passwordsMatch = (pass1, pass2) => {
  return pass1 === pass2;
};

export const validateRegister = (
  email,
  password,
  confirmPassword,
  registeredUsers
) => {
  if (
    isEmpty(email) ||
    isEmpty(password) ||
    isEmpty(confirmPassword)
  ) {
    return {
      valid: false,
      message: "Please fill in all fields.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      message: "Please enter a valid email address.",
    };
  }

  if (!minLength(password, 6)) {
    return {
      valid: false,
      message: "Password must be at least 6 characters.",
    };
  }

  if (!passwordsMatch(password, confirmPassword)) {
    return {
      valid: false,
      message: "Passwords do not match.",
    };
  }

  const exists = registeredUsers.find(
    (user) => user.email === email.trim()
  );

  if (exists) {
    return {
      valid: false,
      message: "This email is already registered.",
    };
  }

  return {
    valid: true,
  };
};

export const validateLogin = (
  email,
  password,
  registeredUsers
) => {
  if (isEmpty(email) || isEmpty(password)) {
    return {
      valid: false,
      message: "Enter both email and password.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      message: "Enter a valid email address.",
    };
  }

  const user = registeredUsers.find(
    (user) =>
      user.email === email.trim() &&
      user.password === password
  );

  if (!user) {
    const emailExists = registeredUsers.find(
      (user) => user.email === email.trim()
    );

    if (emailExists) {
      return {
        valid: false,
        message: "Incorrect password.",
      };
    }

    return {
      valid: false,
      message:
        "Only registered users can login. Register first.",
    };
  }

  return {
    valid: true,
  };
};

export const validateForgot = (
  email,
  registeredUsers
) => {
  if (isEmpty(email)) {
    return {
      valid: false,
      message: "Enter your email address.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      message: "Enter a valid email address.",
    };
  }

  const exists = registeredUsers.find(
    (user) => user.email === email.trim()
  );

  if (!exists) {
    return {
      valid: false,
      message: "No account found with this email.",
    };
  }

  return {
    valid: true,
  };
};

export const validateResetPassword = (
  email,
  password,
  confirmPassword,
  registeredUsers
) => {
  if (isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword)) {
    return {
      valid: false,
      message: "Please fill in all fields.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      message: "Enter a valid email address.",
    };
  }

  if (!minLength(password, 6)) {
    return {
      valid: false,
      message: "Password must be at least 6 characters.",
    };
  }

  if (!passwordsMatch(password, confirmPassword)) {
    return {
      valid: false,
      message: "Passwords do not match.",
    };
  }

  const exists = registeredUsers.find(
    (user) => user.email === email.trim()
  );

  if (!exists) {
    return {
      valid: false,
      message: "No account found with this email.",
    };
  }

  return {
    valid: true,
  };
};