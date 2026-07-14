import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContentArea from "./components/ContentArea";
import WelcomeModal from "./components/WelcomeModal";

export default function App() {
  const [guestName, setGuestName] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const normalizeTitleCase = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleNameSubmit = (name) => {
    setGuestName(normalizeTitleCase(name));
    setShowWelcomeModal(false);
  };

  return (
    <>
      <Header guestName={guestName} />

      <WelcomeModal isOpen={showWelcomeModal} onSubmit={handleNameSubmit} />

      <ContentArea guestName={guestName} />
      <Footer />
    </>
  );
}