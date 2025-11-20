// Wishlist item entity model
export interface Wish {
  // Core identifiers
  id: string;
  title: string;

  // Descriptive details
  description?: string;
  images?: string[];              // URLs or asset identifiers
  tags?: string[];                // Keywords for search/filter

  // Sourcing & commerce
  productUrl?: string;            // Deep link to retailer/product page
  retailer?: string;              // Store or seller name
  sku?: string;                   // Merchant SKU or reference

  // Pricing
  price?: number;                 // Current price
  currency?: string;              // Price currency code (USD, EUR, etc.)
  originalPrice?: number;         // MSRP or list price for comparison
  priceLastCheckedAt?: string;    // ISO timestamp of last price check
  priceTrackingEnabled?: boolean; // Enable price-drop alerts

  // Availability & fulfillment
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder' | 'discontinued';
  estimatedDelivery?: string;     // ISO date or textual estimate
  shippingCost?: number;
  shippingCurrency?: string;

  // Preference & organization
  category?: string;              // e.g., Gadgets, Experiences
  priority: 'low' | 'medium' | 'high';
  quantityDesired?: number;
  quantityFulfilled?: number;
  occasion?: string;              // Birthday, Wedding, etc.
  icon?: string;                  // Emoji or icon identifier
  color?: string;                 // Hex for UI accenting

  // Collaboration & privacy
  isShared: boolean;              // Visible to collaborators
  visibility?: 'private' | 'friends' | 'public';
  reservedBy?: string;            // User ID who claimed the item
  reservedMessage?: string;       // Optional note from reserver
  reservedAt?: string;            // ISO timestamp of reservation

  // Notifications & reminders
  reminderEnabled?: boolean;
  reminderDate?: string;          // ISO date to nudge user or gifters
  reminderDaysBefore?: number;    // Alternative lead-time reminder

  // Status & lifecycle
  isFavorite?: boolean;
  isArchived?: boolean;           // Hide from active lists without deletion
  isPurchased?: boolean;
  purchasedAt?: string;           // ISO date when marked as purchased
  purchasedPrice?: number;
  purchasedBy?: string;           // User ID for tracking fulfills

  // Metadata
  notes?: string;                 // Personal notes or instructions
  createdAt: string;              // ISO creation timestamp
  updatedAt: string;              // ISO last update timestamp
}