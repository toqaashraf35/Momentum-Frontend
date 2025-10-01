// Loading.tsx
import { Clock } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-2 text-[var(--main)]">
        <Clock className="animate-spin" size={20} />
        <p>Loading...</p>
      </div>
    </div>
  );
}
