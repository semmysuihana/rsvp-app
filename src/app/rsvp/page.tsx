import { Suspense } from "react";
import RsvpClient from "./RsvpClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RsvpClient />
    </Suspense>
  );
}
