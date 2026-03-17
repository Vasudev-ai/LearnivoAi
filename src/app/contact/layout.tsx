import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Learnivo AI",
  description: "Get in touch with the Learnivo AI and Vasudev AI teams for support, partnerships, or school inquiries. We're here to help transform your education experience.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
