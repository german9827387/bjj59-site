import Hero from "@/components/Hero";
import ForWhom from "@/components/ForWhom";
import WhyUs from "@/components/WhyUs";
import Directions from "@/components/Directions";
import Trainers from "@/components/Trainers";
import Reviews from "@/components/Reviews";
import Awards from "@/components/Awards";
import Pricing from "@/components/Pricing";
import FirstTraining from "@/components/FirstTraining";
import CTA from "@/components/CTA";
import Contacts from "@/components/Contacts";

export default function Home() {
  return (
    <>
      <Hero />
      <ForWhom />
      <Directions />
      <Trainers />
      <Reviews />
      <Awards />
      <Pricing />
      <FirstTraining />
      <WhyUs />
      <CTA />
      <Contacts />
    </>
  );
}
