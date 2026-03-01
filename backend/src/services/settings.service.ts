/**
 * Settings Service
 * Business logic for website configuration
 */

import { WebsiteConfig, IWebsiteConfigDocument } from '../models';
import { UpdateWebsiteConfigDTO } from '../interfaces';
import { deepMerge, parseBoolean, parseArrayFromString } from '../utils/helpers';

export class SettingsService {
    /**
     * Get website configuration
     */
    static async get(): Promise<IWebsiteConfigDocument> {
        let config = await WebsiteConfig.findOne();
        if (!config) {
            config = await WebsiteConfig.create({});
        }
        return config;
    }

    /**
     * Update website configuration
     */
    static async update(data: UpdateWebsiteConfigDTO): Promise<IWebsiteConfigDocument> {
        let config = await WebsiteConfig.findOne();
        if (!config) {
            config = new WebsiteConfig({});
        }

        // Process features (convert string booleans)
        if (data.features) {
            const features: Record<string, boolean> = {};
            Object.entries(data.features).forEach(([key, value]) => {
                features[key] = parseBoolean(value as unknown as string) ?? false;
            });
            data.features = features;
        }

        // Process SEO keywords
        if (data.seo?.keywords) {
            data.seo.keywords = parseArrayFromString(data.seo.keywords as unknown as string);
        }

        // Deep merge updates
        if (data.site) {
            config.site = deepMerge(config.site as object, data.site) as never;
        }
        if (data.company) {
            config.company = deepMerge(config.company as object, data.company) as never;
        }
        if (data.social) {
            config.social = deepMerge(config.social as object, data.social) as never;
        }
        if (data.seo) {
            config.seo = deepMerge(config.seo as object, data.seo) as never;
        }
        if (data.features) {
            config.features = { ...config.features, ...data.features } as Record<string, boolean>;
        }

        await config.save();
        return config;
    }
}
