/**
 * API Services Index
 * Centralized export for all API services
 */

export { authService } from './auth.service';
export { usersService } from './users.service';
export { productsService } from './products.service';
export { productCategoriesService } from './product-categories.service';
export { transactionsService } from './transactions.service';
export { articlesService } from './articles.service';
export { wasteLocationsService } from './waste-locations.service';
export { dashboardService } from './dashboard.service';

// Re-export client and config
export { default as apiClient } from './client';
export * from './config';
