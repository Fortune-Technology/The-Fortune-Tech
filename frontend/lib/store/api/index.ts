/**
 * API barrel export
 */

// Auth API
export {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyEmailQuery,
    useGetCurrentUserQuery,
    useLazyGetCurrentUserQuery,
} from './authApi';

// Services API
export {
    useGetServicesQuery,
    useGetFeaturedServicesQuery,
    useGetServiceByIdQuery,
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} from './servicesApi';
export type { Service } from './servicesApi';

// Portfolio API
export {
    useGetPortfoliosQuery,
    useGetFeaturedPortfoliosQuery,
    useGetPortfolioByIdQuery,
    useCreatePortfolioMutation,
    useUpdatePortfolioMutation,
    useDeletePortfolioMutation,
} from './portfolioApi';
export type { Portfolio } from './portfolioApi';

// Technologies API
export {
    useGetTechnologiesQuery,
    useGetFeaturedTechnologiesQuery,
    useGetTechnologyByIdQuery,
    useCreateTechnologyCategoryMutation,
    useUpdateTechnologyCategoryMutation,
    useDeleteTechnologyCategoryMutation,
    useAddTechnologyItemMutation,
    useUpdateTechnologyItemMutation,
    useDeleteTechnologyItemMutation,
} from './technologiesApi';
export type { TechnologyCategory, TechnologyItem } from './technologiesApi';

// Testimonials API
export {
    useGetTestimonialsQuery,
    useGetFeaturedTestimonialsQuery,
    useGetTestimonialByIdQuery,
    useCreateTestimonialMutation,
    useUpdateTestimonialMutation,
    useDeleteTestimonialMutation,
} from './testimonialsApi';
export type { Testimonial } from './testimonialsApi';

// Careers API
export {
    useGetCareersQuery,
    useGetCareerByIdQuery,
    useCreateCareerMutation,
    useUpdateCareerMutation,
    useDeleteCareerMutation,
} from './careersApi';
export type { Career } from './careersApi';

// CMS API
export {
    useGetCMSPagesQuery,
    useGetPublishedPagesQuery,
    useGetCMSPageByIdQuery,
    useGetCMSPageBySlugQuery,
    useCreateCMSPageMutation,
    useUpdateCMSPageMutation,
    useDeleteCMSPageMutation,
    usePublishCMSPageMutation,
    useUnpublishCMSPageMutation,
} from './cmsApi';
export type { CMSPage } from './cmsApi';

// Users API
export {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useChangePasswordMutation,
    useDeleteUserMutation,
} from './usersApi';
export type { User } from './usersApi';

// Settings API
export {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} from './settingsApi';
export type { Settings } from './settingsApi';
