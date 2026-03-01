import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Services from '../components/home/Services';
import WhyChooseUs from '../components/home/WhyChooseUs';
import TechStack from '../components/home/TechStack';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

/**
 * Home page - Server Component by default
 * Child components declare their own 'use client' as needed
 * This enables better server-side rendering and reduces JS bundle
 */
export default function Home() {
    return (
        <>
            <Hero />
            <Stats />
            <Services />
            <WhyChooseUs />
            <TechStack />
            <Testimonials />
            <CTA />
        </>
    );
}
