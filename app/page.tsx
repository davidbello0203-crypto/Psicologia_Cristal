import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingBookingButton } from '@/components/ui/FloatingBookingButton'
import { HeroSection } from '@/components/sections/HeroSection'
import { SobreMiSection } from '@/components/sections/SobreMiSection'
import { ServiciosSection } from '@/components/sections/ServiciosSection'
import { FormacionSection } from '@/components/sections/FormacionSection'
import { PorQueConmigoSection } from '@/components/sections/PorQueConmigoSection'
import { ProcesoAtencionSection } from '@/components/sections/ProcesoAtencionSection'
import { FAQSection } from '@/components/sections/FAQSection'
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SobreMiSection />
        <ServiciosSection />
        <FormacionSection />
        <PorQueConmigoSection />
        <ProcesoAtencionSection />
        <FAQSection />
      </main>
      <Footer />
      <FloatingBookingButton />
    </>
  )
}
