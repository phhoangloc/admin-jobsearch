import type { Metadata } from "next";
import { Sawarabi_Gothic } from "next/font/google";
import "../style/globals.css";
import Layout from "@/components/layout/layout";
import Provider from "@/redux/component/provider";
import Modal from "@/components/modal/modal";


const geistSans = Sawarabi_Gothic({
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "若年層モデル事業就職サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-org-bg none-scr`}>
        <Provider>
          <Modal />
          <Layout>
            {children}
          </Layout>
        </Provider>
      </body>
    </html>
  );
}
