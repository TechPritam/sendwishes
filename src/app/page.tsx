import { Footer } from "./_components/Footer";
import { MainProducts } from "./_components/HomeSections";
import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MainProducts />
      </main>
      <Footer />
    </>
  );
}
