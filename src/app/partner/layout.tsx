import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with Us | Learnivo AI Institutional Program",
  description: "Join the Learnivo AI partner ecosystem. We collaborate with schools, education boards, and NGOs to deploy ethical AI solutions across India.",
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
