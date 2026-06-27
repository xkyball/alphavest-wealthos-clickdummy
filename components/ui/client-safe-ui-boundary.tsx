import { cn } from "@/lib/cn";
import {
  uxClientSafeUiAttributesFor,
  uxClientSafeUiBoundaryForPageId,
  type UxClientSafeUiFamily,
} from "@/lib/ux-client-safe-ui-boundary";

type ClientSafeUiBoundaryProps = {
  children: React.ReactNode;
  className?: string;
  family?: UxClientSafeUiFamily;
  pageId: string;
  testId?: string;
};

export function ClientSafeUiBoundary({
  children,
  className,
  family,
  pageId,
  testId = "e07-client-safe-ui-boundary",
}: ClientSafeUiBoundaryProps) {
  const boundary = uxClientSafeUiBoundaryForPageId(pageId, family);

  return (
    <section
      className={cn("contents", className)}
      data-testid={testId}
      {...uxClientSafeUiAttributesFor(boundary)}
    >
      {children}
    </section>
  );
}
