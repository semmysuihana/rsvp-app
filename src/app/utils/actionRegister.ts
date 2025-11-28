"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}


export interface RegisterInput {
  name: string;
  idCardNumber: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  email: string;
  username: string;
  password: string;
}

interface Alert {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export function useRegister() {
 
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const register = api.register.create.useMutation({
    onSuccess: () => {
      setAlert({ type: "success", message: "Register berhasil" });
      setShowAlert(true);
      setLoading(false);
    },
    onError: (err) => {
      setAlert({ type: "error", message: err.message });
      setShowAlert(true);
      setLoading(false);
    },
  });

  const error = (message: string) => {
    setAlert({ type: "error", message });
    setShowAlert(true);
  };

  const handleRegister = (formData: FormData) => {
    const name = formData.get("name");
    const idCardNumber = formData.get("idCardNumber");
    const birthDate = formData.get("birthDate");
    const gender = formData.get("gender");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // ——————————————————————
    // VALIDASI WAJIB ISI
    // ——————————————————————
    if (
      !name ||
      !idCardNumber ||
      !birthDate ||
      !gender ||
      !phone ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return error("Semua field harus diisi");
    }

    // ——————————————————————
    // VALIDASI TIPE
    // ——————————————————————
    if (
      typeof name !== "string" ||
      typeof idCardNumber !== "string" ||
      typeof birthDate !== "string" ||
      typeof gender !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return error("Format input tidak valid");
    }

    // ——————————————————————
    // VALIDASI NIK (16 DIGIT)
    // ——————————————————————
    if (!/^\d{16}$/.test(idCardNumber)) {
      return error("ID Card Number harus 16 digit (NIK)");
    }

    // ——————————————————————
    // VALIDASI NOMOR HP INDONESIA
    // ——————————————————————
    if (!/^(\+628|08)\d{7,12}$/.test(phone)) {
      return error("Nomor telepon tidak valid. Gunakan format Indonesia.");
    }

    // ——————————————————————
    // VALIDASI EMAIL
    // ——————————————————————
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error("Email tidak valid");
    }

    // ——————————————————————
    // USERNAME MINIMAL 8 KARAKTER
    // ——————————————————————
    if (username.trim().length < 8) {
      return error("Username minimal 8 karakter");
    }

    // ——————————————————————
    // PASSWORD RULE:
    // — Minimal 1 huruf kecil
    // — Minimal 1 huruf besar
    // — Minimal 1 angka
    // ——————————————————————
    if (!/[a-z]/.test(password)) {
      return error("Password harus memiliki huruf kecil");
    }
    if (!/[A-Z]/.test(password)) {
      return error("Password harus memiliki huruf besar");
    }
    if (!/[0-9]/.test(password)) {
      return error("Password harus memiliki angka");
    }

    // ——————————————————————
    // CONFIRM PASSWORD
    // ——————————————————————
    if (password !== confirmPassword) {
      return error("Confirm password tidak cocok dengan password");
    }

    // Input final
    setLoading(true);
    const input: RegisterInput = {
      name: name.trim(),
      idCardNumber: idCardNumber.trim(),
      birthDate: birthDate.trim(),
      gender: gender.trim() as Gender,
      phone: phone.trim(),
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
    };
      register.mutate(input);
  };

  return {
    handleRegister,
    loading,
    alert,
    showAlert,
    setShowAlert,
  };
}
