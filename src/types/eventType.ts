export interface DataItem {
  id: string;
  userId: string;
  name: string;
  date: Date;
  time: Date;
  venueName: string;
  address: string;
  rtRw: string;
  district: string;
  subDistrict: string;
  city: string;
  googleMapUrl: string;
  maxPax: number;
  description: string;
  capacity: {
    confirmed: number;
    waiting: number;
    canceled: number;
  };
  updatedAt: Date;
  createdAt: Date;
}

export interface guestItem  {
  id: string;
  eventId: string;
  name: string;
  phone: string;
  email: string;
  rsvpStatus: "WAITING" | "CONFIRMED" | "CANCELLED";
  notes?: string | null;
  substituteName?: string | null;
  pax: number;
  sendCount: number;
  maxSend: number;
  token: string;
  lastSendAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface eventWithGuestItem extends DataItem {
  guests: guestItem[];
}