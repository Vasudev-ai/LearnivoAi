import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from "@/firebase";
import { QueryProvider } from "@/lib/query-provider";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "Learnivo AI | Revolutionizing Education with AI for Schools",
  description: "Learnivo AI is the ultimate edtech ai and education tool for modern schools. Empowering teachers with ai for school, lesson planning, and interactive learning. Built by Vasudev AI.",
  keywords: ["Learnivo AI", "Vasudev AI", "edtech ai", "education tool ai", "school ai", "ai for school", "ai teachers assistant", "indian education ai"],
  authors: [{ name: "Vasudev AI", url: "https://vasudev.online" }],
  openGraph: {
    title: "Learnivo AI - Your AI Partner in Education",
    description: "Transform your classroom with Learnivo AI. The smartest education tool for schools.",
    url: "https://learnivo.app",
    siteName: "Learnivo AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learnivo AI | AI for Schools",
    description: "The next generation of edtech ai is here.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased transition-colors duration-500" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <QueryProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </QueryProvider>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
