import type { Plan } from "@prisma/client";

export function PlanBadge({ plan }: { plan: Plan }) {
  if (plan === "free") return null;

  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={
        plan === "pro"
          ? { backgroundColor: "#1D9E75", color: "white" }
          : { backgroundColor: "#f0fdf8", color: "#1D9E75", border: "0.5px solid #1D9E75" }
      }
    >
      {plan === "pro" ? "Pro" : "Explorer"}
    </span>
  );
}
