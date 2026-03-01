import Image from 'next/image';
import PageHeader from '../../components/ui/PageHeader';
import SectionTitle from '../../components/ui/SectionTitle';
import { FaUsers, FaLightbulb, FaRocket, FaHandshake, FaHeart, FaAward } from 'react-icons/fa';

export default function AboutPage() {
    const team = [
        { name: 'Alex Morgan', role: 'CEO & Founder', bio: 'Tech visionary with 15+ years of experience in enterprise solutions.', image: '/images/team/alex.png' },
        { name: 'Sarah Chen', role: 'CTO', bio: 'Architecture expert specializing in cloud-native systems.', image: '/images/team/sarah.png' },
        { name: 'David Miller', role: 'Head of Design', bio: 'Award-winning UX designer passionate about user-centric experiences.', image: '/images/team/david.png' },
        { name: 'James Wilson', role: 'Lead Developer', bio: 'Full-stack wizard with a love for clean code and performance.', image: '/images/team/james.png' },
    ];

    const values = [
        { icon: FaUsers, title: 'Client First', description: 'We measure our success by the success of our clients.' },
        { icon: FaRocket, title: 'Innovation', description: 'We stay ahead of the curve to bring you cutting-edge solutions.' },
        { icon: FaHandshake, title: 'Integrity', description: 'Transparent communication and honest partnerships.' },
        { icon: FaHeart, title: 'Passion', description: 'We love what we do and it shows in our work.' },
        { icon: FaAward, title: 'Excellence', description: 'We never settle for anything less than the best.' },
        { icon: FaLightbulb, title: 'Creativity', description: 'Unique solutions for unique challenges.' },
    ];

    return (
        <>
            <PageHeader
                title="About Us"
                subtitle="Driven by innovation, guided by values. We're on a mission to transform businesses through technology."
            />

            {/* Company Overview */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-2 about-overview-grid">
                        <div>
                            <span className="section-subtitle">Who We Are</span>
                            <h2 className="about-heading">Building Digital Excellence Since 2016</h2>
                            <p className="about-text">
                                The Fortune Tech is a premier IT consulting and software development firm serving clients globally.
                                We specialize in transforming complex business challenges into elegant digital solutions that drive real results.
                            </p>
                            <p className="about-text">
                                Since our inception, we have partnered with startups and small, medium, and macro-scale enterprises alike to deliver
                                innovative products that accelerate growth, improve efficiency, and create lasting competitive advantages.
                            </p>
                        </div>
                        <div className="about-image-wrapper">
                            <Image
                                src="/images/about/office.png"
                                alt="Our modern office space"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="img-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section bg-alt">
                <div className="container">
                    <div className="grid grid-2">
                        <div className="mv-card">
                            <div className="mv-icon"><FaRocket /></div>
                            <h3>Our Mission</h3>
                            <p>To empower businesses through technology, delivering scalable and sustainable digital solutions that create measurable value and lasting impact.</p>
                        </div>
                        <div className="mv-card">
                            <div className="mv-icon"><FaLightbulb /></div>
                            <h3>Our Vision</h3>
                            <p>To be a prominent tech solutions service provider in the Northeastern United States and the Eastern region of Canada, known for our innovation, integrity, and excellence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section">
                <div className="container">
                    <SectionTitle title="Our Core Values" subtitle="What Drives Us" />
                    <div className="grid grid-3">
                        {values.map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <div key={idx} className="value-card">
                                    <div className="value-icon"><Icon /></div>
                                    <h4>{value.title}</h4>
                                    <p>{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team - Hidden for now */}
            {/*
            <section className="section bg-alt">
                <div className="container">
                    <SectionTitle title="Meet Our Team" subtitle="The Experts" />
                    <div className="grid grid-4">
                        {team.map((member, idx) => (
                            <div key={idx} className="team-card">
                                <div className="team-avatar">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={80}
                                        height={80}
                                        className="img-cover"
                                    />
                                </div>
                                <h4 className="team-name">{member.name}</h4>
                                <span className="team-role">{member.role}</span>
                                <p className="team-bio">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            */}
        </>
    );
}
