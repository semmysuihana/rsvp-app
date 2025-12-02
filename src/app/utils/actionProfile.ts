"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import type { Alert } from "~/types/auth";
import { set } from "zod";

export function useProfile() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // GET PROFILE BY ID
  const {
    data: profile,
    isLoading: fetching,
    refetch,
  } = api.profile.getById.useQuery(profileId ?? "", {
    enabled: !!profileId,
  });

  const handleGetProfile = async (id: string) => {
    try {
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

  console.log("updatedData", updatedData);
  console.log("originalData", originalData);

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
  const loading = fetching || isUpdating;

  return {
    profile: profile ?? null,
    loading,
    alert,
    showAlert,
    setShowAlert,
    handleGetProfile,
    refetch,
    handleUpdate,
  };
}
