"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface Alert {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export function useEvent() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  // RESET EVENT
      const utils = api.useUtils();

  // GET ALL EVENTS (manual trigger)
  const {
    data: events,
    isLoading: fetching,
    refetch,
  } = api.event.getAll.useQuery(undefined, { enabled: false });

  // GET EVENT BY ID (manual trigger)
const {
  data: eventById,
  isLoading: fetchingById,
} = api.event.getById.useQuery(eventId!, {
  enabled: !!eventId,
});

const handleEventById = async (id: string) => {
  try {
    if (!id) return;
    setEventId(id);
  } catch (err) {
    setAlert({
      type: "error",
      message: err instanceof Error ? err.message : "An unknown error occurred",
    });
    setShowAlert(true);
  }
};


  // MUTATION UPDATE
  const { mutate: updateEvent, isPending: updating } = api.event.update.useMutation({
    onSuccess: async () => {
      setAlert({ type: "success", message: "Event updated successfully" });
      setShowAlert(true);
      await refetch();
      await utils.event.getAll.invalidate(); // invalidate list
      await utils.event.getById.invalidate(); // invalidate detail
      router.push("/events");
    },
    onError: (err) => {
      setAlert({ type: "error", message: err.message });
      setShowAlert(true);
    },
  });

  const handleUpdate = (id: string, formData: FormData) => {
    const name = formData.get("name") as string | null;
    const dateString = formData.get("date") as string | null;
    const timeString = formData.get("time") as string | null;
    const date = dateString ? new Date(dateString) : null;
    const time = timeString ? new Date(`1970-01-01T${timeString}:00`) : null;

    const venueName = formData.get("venueName") as string | null;
    const address = formData.get("address") as string | null;
    const rtRw = (formData.get("rtRw") as string | null) ?? "";
    const district = (formData.get("district") as string | null) ?? "";
    const subDistrict = (formData.get("subDistrict") as string | null) ?? "";
    const city = (formData.get("city") as string | null) ?? "";
    const googleMapUrl = (formData.get("googleMapUrl") as string | null) ?? "";
    const maxPax = Number(formData.get("maxPax"));




    if (!name || !date || !time || !venueName || !address || !maxPax || isNaN(maxPax)) {
      setAlert({
        type: "error",
        message: "Name, Date, Time, Venue Name, Address, Max Pax is required",
      });
      setShowAlert(true);
      return;
    }

    updateEvent({
      id,
      userId: session?.user.id ?? "",
      name,
      date,
      time,
      venueName,
      address,
      rtRw,
      district,
      subDistrict,
      city,
      googleMapUrl,
      maxPax,
    });
  };

  // MUTATION CREATE
  const { mutate: createEvent, isPending: creating } = api.event.create.useMutation({
    onSuccess: async () => {
      await refetch();
      router.push("/events");
    },
    onError: (err) => {
      setAlert({ type: "error", message: err.message });
      setShowAlert(true);
    },
  });
    const handleEvent = (formData: FormData) => {
    const name = formData.get("name") as string | null;
    const dateString = formData.get("date") as string | null;
    const timeString = formData.get("time") as string | null;
    const date = dateString ? new Date(dateString) : null;
    const time = timeString ? new Date(`1970-01-01T${timeString}:00`) : null;

    const venueName = formData.get("venueName") as string | null;
    const address = formData.get("address") as string | null;
    const rtRw = (formData.get("rtRw") as string | null) ?? "";
    const district = (formData.get("district") as string | null) ?? "";
    const subDistrict = (formData.get("subDistrict") as string | null) ?? "";
    const city = (formData.get("city") as string | null) ?? "";
    const googleMapUrl = (formData.get("googleMapUrl") as string | null) ?? "";
    const maxPax = Number(formData.get("maxPax"));

    if (!name || !date || !time || !venueName || !address || !maxPax || isNaN(maxPax)) {
      setAlert({
        type: "error",
        message: "Name, Date, Time, Venue Name, Address, Max Pax is required",
      });
      setShowAlert(true);
      return;
    }

    createEvent({
      userId: session?.user.id ?? "",
      name,
      date,
      time,
      venueName,
      address,
      rtRw,
      district,
      subDistrict,
      city,
      googleMapUrl,
      maxPax,
    });
  };

  // MUTATION DELETE
  const { mutate: deleteEvent, isPending: deleting } =
    api.event.delete.useMutation({
      onSuccess: async () => {
        setAlert({ type: "success", message: "Event deleted successfully" });
        setShowAlert(true);
        await refetch();
        await utils.event.getAll.invalidate(); // invalidate list
      await utils.event.getById.invalidate(); // invalidate detail
      },
      onError: (err) => {
        setAlert({ type: "error", message: err.message });
        setShowAlert(true);
      },
    });

  const handleDelete = async (id: string) => {
    if (!id) return;
    deleteEvent(id);
  };



  const loading = fetching || creating || deleting || fetchingById || updating;

  return {
    events: events ?? [],
    eventById: eventById ?? null,
    loading,
    alert,
    showAlert,
    handleEventById,
    handleDelete,
    setShowAlert,
    handleEvent,
    refetch,
    handleUpdate,
  };
}
