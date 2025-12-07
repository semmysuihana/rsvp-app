"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import type { Alert } from "~/types/auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function useProfile() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const { data: session } = useSession();
  
  // GET PROFILE BY ID
  const {
    data: profile,
    isLoading: fetching,
    refetch,
  } = api.profile.getById.useQuery(profileId ?? "", {
    enabled: !!profileId,
  });

  const handleGetProfile = async () => {
    try {
      const id = session?.user.id;
      if (!id) return;
      setProfileId(id);
    } catch (err) {
      setAlert({
        type: "error",
        message: err instanceof Error ? err.message : "An unknown error occurred",
      });
      setShowAlert(true);
    }
  };

  const { mutateAsync: updateProfile, isPending: isUpdating } = api.profile.update.useMutation({
    onSuccess: async () => {
      setShowAlert(true);
      setAlert({ type: "success", message: "Profile updated successfully" });
      await refetch();
    },

    onError: (err) => {
      setShowAlert(true);
      setAlert({ type: "error", message: err instanceof Error ? err.message : "An unknown error occurred" });
    },
  });

  const handleUpdate = async (formData: FormData) => {
     if (!profile) return;

 const updatedData = {
  name: formData.get("name") as string,
  username: formData.get("username") as string,
  email: formData.get("email") as string,
  phone: formData.get("phone") as string,
  gender: formData.get("gender") as "MALE" | "FEMALE",
  idCardNumber: formData.get("idCardNumber") as string,
};

  const originalData = {
    name: profile.name,
    username: profile.username,
    email: profile.email,
    phone: profile.phone,
    gender: profile.gender,
    idCardNumber: profile.idCardNumber,
  };

  // Check if any key changed
  const isChanged = Object.keys(updatedData).some(
    key => updatedData[key as keyof typeof updatedData] !== originalData[key as keyof typeof originalData]
  );

  if (!isChanged) {
    setShowAlert(true);
    setAlert({
      type: "error",
      message: "Tidak ada perubahan data",
    })
    return;
  }
  if(
    updatedData.name === "" ||
    updatedData.username === "" ||
    updatedData.email === "" ||
    updatedData.phone === "" ||
    updatedData.gender === undefined ||
    updatedData.idCardNumber === ""
  ) {
    setShowAlert(true);
    setAlert({
      type: "error",
      message: "Data tidak boleh kosong",
    })
    return;
  }
  await updateProfile(updatedData);
  };

  // UPDATE PASSWORD MUTATION
  const { mutate: updatePassword, isPending: isUpdatingPassword } = api.profile.updatePassword.useMutation({
    onSuccess: async () => {
      setShowAlert(true);
      setAlert({ type: "success", message: "Password updated successfully" });
    },
    onError: (err) => {
      setShowAlert(true);
      setAlert({ type: "error", message: err.message });
    },
  });

  const handleUpdatePassword = async (formData: FormData) => {
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setShowAlert(true);
      setAlert({
        type: "error",
        message: "All password fields are required",
      });
      return;
    }

    if (newPassword.length < 8) {
      setShowAlert(true);
      setAlert({
        type: "error",
        message: "New password must be at least 8 characters",
      });
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setShowAlert(true);
      setAlert({ type: "error", message: "Password must have lowercase letter" });
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setShowAlert(true);
      setAlert({ type: "error", message: "Password must have uppercase letter" });
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setShowAlert(true);
      setAlert({ type: "error", message: "Password must have number" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setShowAlert(true);
      setAlert({
        type: "error",
        message: "New password and confirm password do not match",
      });
      return;
    }

     updatePassword({
      oldPassword,
      newPassword,
      confirmPassword,
    });

  };

  const loading = fetching || isUpdating || isUpdatingPassword;

  return {
    profile: profile ?? null,
    loading,
    alert,
    showAlert,
    setShowAlert,
    handleGetProfile,
    refetch,
    handleUpdate,
    handleUpdatePassword,
  };
}
