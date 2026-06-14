import { notFound } from "next/navigation";
import { BoardShell } from "./board-shell";
import { getBoardRoute } from "@/lib/routes";

export function BoardPage({
  route,
  primaryAction
}: {
  route: string;
  primaryAction?: {
    href: string;
    label: string;
  };
}) {
  const board = getBoardRoute(route);

  if (!board) {
    notFound();
  }

  return <BoardShell board={board} primaryAction={primaryAction} />;
}
