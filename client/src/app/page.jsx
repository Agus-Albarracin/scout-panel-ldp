import { AuthGate } from "@/components/Auth/AuthGate";
import { ScoutPanel } from "@/components/ScoutPanel";

export default function Home() {
  return (
    <AuthGate>
      <ScoutPanel />
    </AuthGate>
  );
}
