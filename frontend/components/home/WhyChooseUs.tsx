import SectionTitle from '../ui/SectionTitle';
import websiteConfig from '../../data/website-config.json';
import { getIcon } from '../../lib/icons';

// Extract config at module level - static data
const { whyChooseUs } = websiteConfig;

export default function WhyChooseUs() {
    return (
        <section className="section choose-us-section">
            <div className="container">
                <SectionTitle title={whyChooseUs.title} subtitle={whyChooseUs.subtitle} />

                <div className="grid grid-4">
                    {whyChooseUs.features.map((feature, index) => {
                        const Icon = getIcon(feature.icon);
                        return (
                            <div key={index} className="reason-card">
                                <div className="icon-wrapper">
                                    {Icon && <Icon />}
                                </div>
                                <h3 className="reason-title">{feature.title}</h3>
                                <p className="reason-text">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

