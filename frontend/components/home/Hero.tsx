import Image from 'next/image';
import Button from '../ui/Button';
import { FaArrowRight } from 'react-icons/fa';
import websiteConfig from '../../data/website-config.json';

export default function Hero() {
  const { hero } = websiteConfig;

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            {hero.badge.showDot && <span className="hero-badge-dot"></span>}
            {hero.badge.text}
          </div>

          <h1 className="hero-title">
            {hero.title.line1}
            <br />
            <span className="highlight">{hero.title.highlight}</span> {hero.title.line2}
          </h1>

          <p className="hero-text">
            {hero.description}
          </p>

          <div className="hero-buttons">
            <Button href={hero.cta.primary.href} variant="primary">
              {hero.cta.primary.label} <FaArrowRight />
            </Button>
            <Button href={hero.cta.secondary.href} variant="outline">
              {hero.cta.secondary.label}
            </Button>
          </div>
        </div>

        <div className="hero-visual">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="img-cover"
          />
        </div>
      </div>
    </section>
  );
}
