"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

interface Alert {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface RsvpStatus {
  WAITING: "WAITING";
  CONFIRMED: "CONFIRMED";
  CANCELLED: "CANCELLED";
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
      await utils.event.getById.invalidate();
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
      await utils.event.getById.invalidate();
      
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

  const { mutateAsync: updateGuest, isPending: updating } = api.guest.update.useMutation({
    onSuccess: async () => {
      await refetch();
      await refetchDetail();
      await utils.guest.getEventWithGuests.invalidate();
      await utils.event.getById.invalidate();
      
      setAlert({
        type: "success",
        message: "Guest updated successfully",
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

  const handleAddGuest = async (id: string, formData: FormData) => {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const rsvpStatus = formData.get("rsvpStatus") as keyof RsvpStatus | null;
    const notes = formData.get("notes") as string;
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
      return false;
    }

    if (!id) {
      setAlert({
        type: "error",
        message: "Event ID is missing",
      });
      setShowAlert(true);
      return false;
    }

    const pax = paxStr ? parseInt(paxStr, 10) : 1;
    const maxSend = maxSendStr ? parseInt(maxSendStr, 10) : 3;
    
    try {
      await createGuest({
        eventId: id,
        name,
        phone,
        email: email || undefined,
        rsvpStatus: rsvpStatus || "WAITING",
        notes: notes || undefined,
        substituteName: substituteName || undefined,
        pax,
        maxSend,
      });
      return true;
    } catch (error) {
      console.error("Add guest error:", error);
      return false;
    }
  };

  const handleUpdateGuest = async (id: string, formData: FormData) => {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const rsvpStatus = formData.get("rsvpStatus") as keyof RsvpStatus | null;
    const notes = formData.get("notes") as string;
    const substituteName = formData.get("substituteName") as string;
    const paxStr = formData.get("pax") as string;

    // Validation
    if (!id) {
      setAlert({
        type: "error",
        message: "Guest ID is missing",
      });
      setShowAlert(true);
      return false;
    }

    const pax = paxStr ? parseInt(paxStr, 10) : undefined;
    
    try {
      await updateGuest({
        id,
        name: name || undefined,
        phone: phone || undefined,
        email: email || undefined,
        rsvpStatus: rsvpStatus || undefined,
        notes: notes || undefined,
        substituteName: substituteName || undefined,
        pax,
      });
      return true;
    } catch (error) {
      console.error("Update guest error:", error);
      return false;
    }
  };
  console.log("Guest loading states:", eventByGuest);
  const loading = getting || deleting || creating || updating || gettingDetail;
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
    handleUpdateGuest,
  };
}
