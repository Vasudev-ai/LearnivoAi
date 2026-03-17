import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Learnivo AI",
  description: "Review the terms and conditions for using Learnivo AI, the leading school AI and edtech platform built by Vasudev AI.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
