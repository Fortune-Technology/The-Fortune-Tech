/**
 * Shared icon utility module
 * Centralizes icon imports to reduce bundle size and avoid duplicate imports
 * across components. This follows DRY principles while avoiding over-engineering.
 */

import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

// Combined icon sets - merged once at module level for efficiency
const AllIcons = { ...FaIcons, ...SiIcons };

/**
 * Resolves an icon component by name from the combined Fa/Si icon sets
 * @param iconName - The icon name (e.g., 'FaRocket', 'SiReact')
 * @returns The icon component or undefined if not found
 */
export function getIcon(iconName: string): React.ComponentType | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (AllIcons as any)[iconName];
}

// Re-export commonly used icons for direct imports
// This allows tree-shaking when specific icons are needed
export {
    FaRocket,
    FaUsers,
    FaAward,
    FaCode,
    FaServer,
    FaDatabase,
    FaCloud,
    FaArrowRight,
    FaCheck,
    FaStar,
    FaQuoteLeft,
    FaLinkedin,
    FaTwitter,
    FaGithub,
    FaDribbble,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaPaperPlane,
    FaBars,
    FaTimes,
    FaSun,
    FaMoon,
    FaUser,
    FaUserPlus,
    FaGlobe,
    FaExternalLinkAlt,
    FaCheckCircle,
} from 'react-icons/fa';
