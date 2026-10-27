export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SalonStatus = 'pending' | 'approved' | 'suspended';
export type SalonGender = 'ladies' | 'gents' | 'unisex';
export type PriceTier = 'budget' | 'mid' | 'premium';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pay_at_salon' | 'paid';
export type SubscriptionStatus = 'pending_review' | 'approved' | 'rejected';
export type UserRole = 'owner' | 'admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: UserRole;
          created_at?: string;
        };
        Update: {
          role?: UserRole;
        };
      };
      salons: {
        Row: {
          id: string;
          owner_id: string;
          slug: string;
          name: string;
          tagline: string | null;
          description: string | null;
          categories: string[];
          gender_type: SalonGender;
          district: string;
          city: string;
          address: string;
          lat: number | null;
          lng: number | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          instagram: string | null;
          facebook: string | null;
          logo_url: string | null;
          banner_url: string | null;
          price_tier: PriceTier;
          status: SalonStatus;
          is_featured: boolean;
          avg_rating: number;
          review_count: number;
          billing_code: string;
          plan: 'free' | 'pro';
          plan_expires_at: string | null;
          trial_ends_at: string | null;
          auto_confirm: boolean;
          min_lead_hours: number;
          max_advance_days: number;
          cancellation_hours: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          slug: string;
          name: string;
          tagline?: string | null;
          description?: string | null;
          categories?: string[];
          gender_type?: SalonGender;
          district: string;
          city: string;
          address: string;
          lat?: number | null;
          lng?: number | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          logo_url?: string | null;
          banner_url?: string | null;
          price_tier?: PriceTier;
          status?: SalonStatus;
          is_featured?: boolean;
          avg_rating?: number;
          review_count?: number;
          billing_code: string;
          plan?: 'free' | 'pro';
          plan_expires_at?: string | null;
          trial_ends_at?: string | null;
          auto_confirm?: boolean;
          min_lead_hours?: number;
          max_advance_days?: number;
          cancellation_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['salons']['Insert']>;
      };
      salon_hours: {
        Row: {
          id: string;
          salon_id: string;
          weekday: number;
          open_time: string;
          close_time: string;
          break_start: string | null;
          break_end: string | null;
          is_closed: boolean;
        };
        Insert: {
          id?: string;
          salon_id: string;
          weekday: number;
          open_time?: string;
          close_time?: string;
          break_start?: string | null;
          break_end?: string | null;
          is_closed?: boolean;
        };
        Update: Partial<Database['public']['Tables']['salon_hours']['Insert']>;
      };
      salon_closures: {
        Row: {
          id: string;
          salon_id: string;
          closure_date: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          salon_id: string;
          closure_date: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['salon_closures']['Insert']>;
      };
      salon_images: {
        Row: {
          id: string;
          salon_id: string;
          url: string;
          alt: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          salon_id: string;
          url: string;
          alt?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['salon_images']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          salon_id: string;
          kind: 'service' | 'package';
          name: string;
          category: string;
          description: string | null;
          duration_min: number;
          price_lkr: number;
          includes: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          salon_id: string;
          kind?: 'service' | 'package';
          name: string;
          category: string;
          description?: string | null;
          duration_min: number;
          price_lkr: number;
          includes?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      staff: {
        Row: {
          id: string;
          salon_id: string;
          name: string;
          role: string;
          photo_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          salon_id: string;
          name: string;
          role?: string;
          photo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['staff']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          reference: string;
          salon_id: string;
          staff_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          starts_at: string;
          ends_at: string;
          status: BookingStatus;
          payment_status: PaymentStatus;
          payment_method: string;
          total_lkr: number;
          notes: string | null;
          manage_token_hash: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          salon_id: string;
          staff_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          starts_at: string;
          ends_at: string;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
          payment_method?: string;
          total_lkr?: number;
          notes?: string | null;
          manage_token_hash: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      booking_items: {
        Row: {
          id: string;
          booking_id: string;
          service_id: string | null;
          name: string;
          price_lkr: number;
          duration_min: number;
        };
        Insert: {
          id?: string;
          booking_id: string;
          service_id?: string | null;
          name: string;
          price_lkr: number;
          duration_min: number;
        };
        Update: Partial<Database['public']['Tables']['booking_items']['Insert']>;
      };
      subscription_payments: {
        Row: {
          id: string;
          salon_id: string;
          plan: 'pro';
          months: 1 | 3 | 12;
          amount_lkr: number;
          status: SubscriptionStatus;
          reference_code: string;
          payer_name: string | null;
          transfer_date: string | null;
          bank_reference: string | null;
          receipt_url: string | null;
          owner_note: string | null;
          submitted_at: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          reject_reason: string | null;
        };
        Insert: {
          id?: string;
          salon_id: string;
          plan?: 'pro';
          months: 1 | 3 | 12;
          amount_lkr: number;
          status?: SubscriptionStatus;
          reference_code: string;
          payer_name?: string | null;
          transfer_date?: string | null;
          bank_reference?: string | null;
          receipt_url?: string | null;
          owner_note?: string | null;
          submitted_at?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          reject_reason?: string | null;
        };
        Update: Partial<Database['public']['Tables']['subscription_payments']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          recipient_user_id: string | null;
          recipient_role: 'admin' | 'owner' | null;
          type: string;
          title: string;
          body: string;
          link: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_user_id?: string | null;
          recipient_role?: 'admin' | 'owner' | null;
          type: string;
          title: string;
          body: string;
          link?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          salon_id: string;
          rating: number;
          comment: string | null;
          owner_reply: string | null;
          status: 'published' | 'hidden';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          salon_id: string;
          rating: number;
          comment?: string | null;
          owner_reply?: string | null;
          status?: 'published' | 'hidden';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_type: string;
          target_id: string;
          metadata: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_type: string;
          target_id: string;
          metadata?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      platform_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          value?: Json;
          updated_at?: string;
        };
      };
    };
    Views: {
      public_salons: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          description: string | null;
          categories: string[];
          gender_type: SalonGender;
          district: string;
          city: string;
          address: string;
          lat: number | null;
          lng: number | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          instagram: string | null;
          facebook: string | null;
          logo_url: string | null;
          banner_url: string | null;
          price_tier: PriceTier;
          status: SalonStatus;
          is_featured: boolean;
          avg_rating: number;
          review_count: number;
          plan: 'free' | 'pro';
          plan_expires_at: string | null;
          trial_ends_at: string | null;
          auto_confirm: boolean;
          min_lead_hours: number;
          max_advance_days: number;
          cancellation_hours: number;
          created_at: string;
          is_pro_active: boolean;
        };
      };
    };
  };
}
