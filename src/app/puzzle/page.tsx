import { Footer } from "../_components/Footer";
import { Navbar } from "../_components/Navbar";
import { PuzzleCreate } from "./_components/PuzzleCreate";

export default function PuzzlePage() {
  return (
    <>
      <Navbar />
      <main>
        <PuzzleCreate />
      </main>
      <Footer />
    </>
  );
}
