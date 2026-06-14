import { BoardPage } from "@/components/board-page";

export default function PresentationPage() {
  return (
    <BoardPage
      primaryAction={{ href: "/mobile", label: "Start Click-Dummy" }}
      route="/presentation"
    />
  );
}
