import { Footer } from "../../_components/Footer";
import { Navbar } from "../../_components/Navbar";
import { SurpriseResultClient } from "../../_components/SurpriseResultClient";

export default function PuzzleResultPage() {
  return (
    <>
      <Navbar />
      <main>
        <SurpriseResultClient expectedType="puzzle" />
      </main>
      <Footer />
    </>
  );
}
