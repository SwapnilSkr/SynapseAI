import Contact from "@/components/static/Contact";
import Features from "@/components/static/Features";
import Footer from "@/components/static/Footer";
import Hero from "@/components/static/Hero";
import Navbar from "@/components/static/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Contact />
      <Footer />
    </>
  );
}
