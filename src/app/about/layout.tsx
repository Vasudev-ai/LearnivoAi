import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Learnivo AI - Mission to Transform Schools",
  description: "Learn how Learnivo AI and Vasudev AI are building the future of classroom management and teacher productivity with high-performance edtech ai tools.",
  keywords: ["About Learnivo", "Vasudev AI mission", "EdTech vision India", "AI for teachers"],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
