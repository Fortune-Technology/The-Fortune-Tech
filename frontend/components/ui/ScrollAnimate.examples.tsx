// Example of how to use ScrollAnimate in your pages/components
// Import this in any page where you want scroll animations

import ScrollAnimate from '@/components/ui/ScrollAnimate';

export function AnimationExamples() {
    return (
        <div className="container section">
            {/* Example 1: Fade Up (most common) */}
            <ScrollAnimate animation="fade-up">
                <h2 className="section-title">Our Services</h2>
            </ScrollAnimate>

            {/* Example 2: Multiple cards with stagger effect */}
            <div className="grid grid-3">
                {[1, 2, 3].map((i) => (
                    <ScrollAnimate
                        key={i}
                        animation="fade-up"
                        delay={i * 0.15}  // Each card delays by 0.15s more
                    >
                        <div className="glass-card">
                            <h3>Service {i}</h3>
                            <p>Description of service {i}</p>
                        </div>
                    </ScrollAnimate>
                ))}
            </div>

            {/* Example 3: Scale animation for emphasis */}
            <ScrollAnimate animation="scale" duration={0.8}>
                <div className="stats-card">
                    <h2>500+</h2>
                    <p>Happy Clients</p>
                </div>
            </ScrollAnimate>

            {/* Example 4: Side-to-side animations */}
            <div className="grid grid-2">
                <ScrollAnimate animation="fade-right">
                    <div className="content-left">
                        <h3>From the left</h3>
                    </div>
                </ScrollAnimate>

                <ScrollAnimate animation="fade-left">
                    <div className="content-right">
                        <h3>From the right</h3>
                    </div>
                </ScrollAnimate>
            </div>

            {/* Example 5: Sequential animations */}
            <ScrollAnimate animation="fade-up">
                <h2>Why Choose Us</h2>
            </ScrollAnimate>

            <ScrollAnimate animation="fade" delay={0.2}>
                <p>We provide the best solutions...</p>
            </ScrollAnimate>

            <ScrollAnimate animation="fade-up" delay={0.4}>
                <button className="btn btn-primary">Get Started</button>
            </ScrollAnimate>

            {/* Example 6: Control visibility threshold */}
            <ScrollAnimate
                animation="fade-up"
                threshold={0.5}  // Element must be 50% visible before animating
                duration={1}
            >
                <div className="large-section">
                    This animates when 50% visible
                </div>
            </ScrollAnimate>
        </div>
    );
}

/* 
USAGE IN YOUR PAGES:

1. Import the component:
   import ScrollAnimate from '@/components/ui/ScrollAnimate';

2. Wrap any element you want to animate:
   <ScrollAnimate animation="fade-up">
     <YourComponent />
   </ScrollAnimate>

3. Customize with props:
   - animation: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade'
   - delay: number (in seconds)
   - duration: number (in seconds)
   - threshold: number (0-1, percentage of element visible)

TIPS:
- Use delay to create stagger effects
- Use threshold to control when animations trigger
- Don't overuse - animate key elements only
- Test on different screen sizes
*/
