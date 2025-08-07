import apiService from './apiService';

const propertyService = {
  // Get all properties with optional filters
  getProperties(params = {}) {
    return apiService.get('properties/', { ...params });
  },

  // Get a single property by slug
  getProperty(slug) {
    return apiService.get(`properties/${slug}/`);
  },

  // Create a new property (requires authentication)
  createProperty(propertyData) {
    return apiService.post('properties/', propertyData);
  },

  // Update a property (requires authentication and ownership)
  updateProperty(slug, propertyData) {
    return apiService.put(`properties/${slug}/`, propertyData);
  },

  // Partially update a property (requires authentication and ownership)
  patchProperty(slug, propertyData) {
    return apiService.patch(`properties/${slug}/`, propertyData);
  },

  // Delete a property (requires authentication and ownership)
  deleteProperty(slug) {
    return apiService.delete(`properties/${slug}/`);
  },

  // Upload property images (requires authentication and ownership)
  uploadPropertyImages(slug, files) {
    const uploadPromises = files.map(file => 
      apiService.upload(`properties/${slug}/images/`, file, 'image')
    );
    return Promise.all(uploadPromises);
  },

  // Get featured properties
  getFeaturedProperties(limit = 6) {
    return this.getProperties({ 
      is_featured: true, 
      limit,
      ordering: '-created_at' 
    });
  },

  // Get properties by type (sale/rent)
  getPropertiesByType(listingType, params = {}) {
    return this.getProperties({ 
      listing_type: listingType, 
      ...params 
    });
  },

  // Search properties with filters
  searchProperties(filters = {}) {
    return this.getProperties(filters);
  },

  // Get similar properties (by type, location, etc.)
  getSimilarProperties(slug, params = {}) {
    return apiService.get(`properties/${slug}/similar/`, { ...params });
  },
};

export default propertyService;
