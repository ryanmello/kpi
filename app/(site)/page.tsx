import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import HomePage from "./components/Home";

export default function page() {
  return (
    <div>
      <h1>KPI</h1>
      <Button>Click me</Button>
      <HomePage />
    </div>
  );
}
