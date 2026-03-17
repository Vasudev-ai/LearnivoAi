import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Learnivo AI",
  description: "Read the Learnivo AI privacy policy to understand how we protect your data and ensure student privacy in our edtech platform.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
