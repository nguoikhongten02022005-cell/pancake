import Hero from '@/components/Hero';
import Solutions from '@/components/Solutions';
import UseCases from '@/components/UseCases';
import SuccessStories from '@/components/SuccessStories';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Solutions />
      <UseCases />
      <SuccessStories />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
