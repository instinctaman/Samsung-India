import { VerifyLocationResult } from "@/api/attendance";
import LocationVerifiedView from "@/components/attendance/LocationVerifiedView";

type LocationVerifiedStepParams = {
  title?: string;
  time?: string;
  endTime?: string;
  date?: string;
  location?: string;
};

type LocationVerifiedStepProps = {
  params: LocationVerifiedStepParams;
  locationResult: VerifyLocationResult | null;
  verifiedAt: Date | null;
  onContinue: () => void;
};

export default function LocationVerifiedStep({ params, locationResult, verifiedAt, onContinue }: LocationVerifiedStepProps) {
  const formattedTime =
    verifiedAt?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) || "09:16:20";
  const venueName = locationResult?.venueLabel || params.location || "Gurugram Sector 4";

  return (
    <LocationVerifiedView
      info={{
        sessionTitle: params.title || "Training Session",
        sessionTime: [params.time, params.endTime].filter(Boolean).join(" - ") || "09:00 AM - 02:00 PM",
        date: params.date || "16 July 2026",
        location: params.location || "Gurugram",
        verifiedTime: formattedTime,
        venueLabel: venueName,
      }}
      onContinue={onContinue}
    />
  );
}
