import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "「仕事の辞めどき診断」",
  description:
    "今の職場、本当に続けるべき？あなたの置かれている状況がどれくらい大変かを客観的にスピード診断します。まずはやってみよう！",
  openGraph: {
    title: "「仕事の辞めどき診断」",
    description:
      "今の職場、本当に続けるべき？あなたがどれほど大変な状況にあるかを客観的に診断します。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "「仕事の辞めどき診断」",
    description:
      "今の職場、本当に続けるべき？あなたがどれほど大変な状況にあるかを客観的に診断します。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
