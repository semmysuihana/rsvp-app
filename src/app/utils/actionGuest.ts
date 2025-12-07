"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

interface Alert {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export function useGuest() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const utils = api.useUtils();
  const { data: eventByGuest, isLoading: getting, refetch } = api.guest.getEventWithGuests.useQuery(
    eventId ?? "",
    { enabled: !!eventId }
  );

  const { data: guestDetail, isLoading: gettingDetail, refetch: refetchDetail } = api.guest.getById.useQuery(
    guestId ?? "",
    { enabled: !!guestId }
  );

  const { mutate: deleteGuest, isPending: deleting } = api.guest.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      await utils.guest.getEventWithGuests.invalidate();
      setAlert({
        type: "success",
        message: "Guest deleted successfully",
      });
      setShowAlert(true);
    },
    onError: (err) => {
      setAlert({
        type: "error",
        message: err.message,
      });
      setShowAlert(true);
    },
  });

  const { mutateAsync: createGuest, isPending: creating } = api.guest.create.useMutation({
    onSuccess: async () => {
      await refetch();
      await utils.guest.getEventWithGuests.invalidate();
      setAlert({
        type: "success",
        message: "Guest added successfully",
      });
      setShowAlert(true);
    },
    onError: (err) => {
      setAlert({
        type: "error",
        message: err.message,
      });
      setShowAlert(true);
    },
  });


  const handleGuestById = (id: string) => {
    if (!id) return;
    setEventId(id);
  };

  const handleGetGuestDetail = (id: string) => {
    if (!id) return;
    setGuestId(id);
  };
  
  const handleDeleteGuest = async (id: string) => {
    if (!id) return;
    deleteGuest(id);
  };

  const handleAddGuest = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("note") as string;
    const substituteName = formData.get("substituteName") as string;
    const paxStr = formData.get("pax") as string;
    const maxSendStr = formData.get("maxSend") as string;

    // Validation
    if (!name || !phone) {
      setAlert({
        type: "error",
        message: "Guest name and phone are required",
      });
      setShowAlert(true);
      return;
    }

    if (!eventId) {
      setAlert({
        type: "error",
        message: "Event ID is missing",
      });
      setShowAlert(true);
      return;
    }

    const pax = paxStr ? parseInt(paxStr, 10) : 1;
    const maxSend = maxSendStr ? parseInt(maxSendStr, 10) : 3;

    try {
      await createGuest({
        eventId,
        name,
        phone,
        notes: notes || undefined,
        substituteName: substituteName || undefined,
        pax,
        maxSend,
      });
    } catch (error) {
      console.error("Add guest error:", error);
    }
  };

  const loading = getting || deleting || creating || gettingDetail;
  return {
    guests: eventByGuest?.guests ?? [],
    eventById: eventByGuest ?? null,
    guestDetail: guestDetail ?? null,
    alert,
    setAlert,
    showAlert,
    setShowAlert,
    loading,
    refetch,
    refetchDetail,
    handleGuestById,
    handleGetGuestDetail,
    handleDeleteGuest,
    handleAddGuest,
  };
}
