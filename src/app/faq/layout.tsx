import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Learnivo AI",
  description: "Find answers to common questions about Learnivo AI, credit usage, student privacy, and how edtech ai is transforming Indian classrooms.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
