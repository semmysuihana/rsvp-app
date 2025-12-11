"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

interface Alert {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export default function useDashboard() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // GET ALL EVENTS + STATS
  const {
    data: events,
    isLoading: fetchingEvents,
    refetch: refetchEvents,
  } = api.event.getAllWithStats.useQuery(undefined);

  const loading = fetchingEvents;

  // Calculate stats from capacity
  const totalGuests = events?.reduce(
    (sum, e) => sum + (e.capacity?.confirmed ?? 0) + (e.capacity?.waiting ?? 0) + (e.capacity?.canceled ?? 0), 
    0
  ) ?? 0;

  const totalConfirmed = events?.reduce(
    (sum, e) => sum + (e.capacity?.confirmed ?? 0), 
    0
  ) ?? 0;

  const totalWaiting = events?.reduce(
    (sum, e) => sum + (e.capacity?.waiting ?? 0), 
    0
  ) ?? 0;

  const totalCancelled = events?.reduce(
    (sum, e) => sum + (e.capacity?.canceled ?? 0), 
    0
  ) ?? 0;

  return {
    events: events ?? [],
    totalEvents: events?.length ?? 0,
    totalGuests,
    totalConfirmed,
    totalWaiting,
    totalCancelled,
    loading,
    alert,
    showAlert,
    setAlert,
    setShowAlert,
    refetchEvents,
  };
}
