import Button from '../ui/Button';
import { FaRocket } from 'react-icons/fa';
import websiteConfig from '../../data/website-config.json';

export default function CTA() {
  const { cta } = websiteConfig;

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">{cta.title}</h2>
          <p className="cta-text">
            {cta.description}
          </p>
          <Button href={cta.button.href} variant="primary">
            <FaRocket /> {cta.button.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
