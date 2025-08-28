import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto min-h-[70dvh] px-4 py-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
