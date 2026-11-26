import { createFileRoute } from "@tanstack/react-router";
import { HskApp } from "@/components/hsk-app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <HskApp />;
}
