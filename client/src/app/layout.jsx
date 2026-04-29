import "./globals.css";

export const metadata = {
  title: "Scout Panel",
  description: "Frontend for the scout panel API"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

