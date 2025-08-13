export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      add_ons: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          theater_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          theater_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          theater_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_add_ons_theater_id"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_add_ons_vendor_id"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "fk_add_ons_vendor_id"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      addresses: {
        Row: {
          address: string
          address_for: Database["public"]["Enums"]["address_type"]
          area: string | null
          created_at: string
          floor: string | null
          id: string
          name: string | null
          nearby: string | null
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          address_for: Database["public"]["Enums"]["address_type"]
          area?: string | null
          created_at?: string
          floor?: string | null
          id?: string
          name?: string | null
          nearby?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          address_for?: Database["public"]["Enums"]["address_type"]
          area?: string | null
          created_at?: string
          floor?: string | null
          id?: string
          name?: string | null
          nearby?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          add_ons: Json | null
          booking_date: string
          booking_time: string | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          duration_hours: number | null
          id: string
          inquiry_time: string | null
          metadata: Json | null
          notification_sent: boolean | null
          payment_status: string | null
          razorpay_amount: number | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          service_listing_id: string | null
          special_requirements: string | null
          status: string
          sylonow_qr_amount: number | null
          sylonow_qr_payment_id: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
          vendor_confirmation: boolean | null
          vendor_id: string | null
          venue_address: string | null
          venue_coordinates: Json | null
        }
        Insert: {
          add_ons?: Json | null
          booking_date: string
          booking_time?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          duration_hours?: number | null
          id?: string
          inquiry_time?: string | null
          metadata?: Json | null
          notification_sent?: boolean | null
          payment_status?: string | null
          razorpay_amount?: number | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          service_listing_id?: string | null
          special_requirements?: string | null
          status?: string
          sylonow_qr_amount?: number | null
          sylonow_qr_payment_id?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
          vendor_confirmation?: boolean | null
          vendor_id?: string | null
          venue_address?: string | null
          venue_coordinates?: Json | null
        }
        Update: {
          add_ons?: Json | null
          booking_date?: string
          booking_time?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          duration_hours?: number | null
          id?: string
          inquiry_time?: string | null
          metadata?: Json | null
          notification_sent?: boolean | null
          payment_status?: string | null
          razorpay_amount?: number | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          service_listing_id?: string | null
          special_requirements?: string | null
          status?: string
          sylonow_qr_amount?: number | null
          sylonow_qr_payment_id?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
          vendor_confirmation?: boolean | null
          vendor_id?: string | null
          venue_address?: string | null
          venue_coordinates?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_listing_id_fkey"
            columns: ["service_listing_id"]
            isOneToOne: false
            referencedRelation: "service_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      cakes: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discounted_price: number | null
          flavor: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          preparation_time_minutes: number | null
          price: number
          size: string | null
          theater_id: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          flavor?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          preparation_time_minutes?: number | null
          price?: number
          size?: string | null
          theater_id: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          flavor?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          preparation_time_minutes?: number | null
          price?: number
          size?: string | null
          theater_id?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cakes_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cakes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "cakes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color_code: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_discount_amount: number | null
          min_order_amount: number | null
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      decorations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          theater_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          theater_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          theater_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_decorations_theater_id"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      extra_special_services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discounted_price: number | null
          duration_minutes: number | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          duration_minutes?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          duration_minutes?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extra_special_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "extra_special_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discounted_price: number | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gifts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "gifts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          body: string
          booking_id: string | null
          created_at: string | null
          data: Json | null
          error_message: string | null
          fcm_response: Json | null
          fcm_token: string
          id: string
          last_attempt: string | null
          notification_type: string
          order_id: string | null
          retry_count: number | null
          sent: boolean | null
          sent_at: string | null
          title: string
          vendor_id: string | null
        }
        Insert: {
          body: string
          booking_id?: string | null
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          fcm_response?: Json | null
          fcm_token: string
          id?: string
          last_attempt?: string | null
          notification_type: string
          order_id?: string | null
          retry_count?: number | null
          sent?: boolean | null
          sent_at?: string | null
          title: string
          vendor_id?: string | null
        }
        Update: {
          body?: string
          booking_id?: string | null
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          fcm_response?: Json | null
          fcm_token?: string
          id?: string
          last_attempt?: string | null
          notification_type?: string
          order_id?: string | null
          retry_count?: number | null
          sent?: boolean | null
          sent_at?: string | null
          title?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "notification_queue_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      occasions: {
        Row: {
          color_code: string | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          advance_amount: number | null
          advance_payment_id: string | null
          booking_date: string
          booking_time: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          payment_status: string
          place_image_url: string | null
          remaining_amount: number | null
          remaining_payment_id: string | null
          service_description: string | null
          service_listing_id: string | null
          service_title: string
          special_requirements: string | null
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
          venue_address: string | null
          venue_coordinates: Json | null
        }
        Insert: {
          advance_amount?: number | null
          advance_payment_id?: string | null
          booking_date: string
          booking_time?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          payment_status?: string
          place_image_url?: string | null
          remaining_amount?: number | null
          remaining_payment_id?: string | null
          service_description?: string | null
          service_listing_id?: string | null
          service_title: string
          special_requirements?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
          venue_address?: string | null
          venue_coordinates?: Json | null
        }
        Update: {
          advance_amount?: number | null
          advance_payment_id?: string | null
          booking_date?: string
          booking_time?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          payment_status?: string
          place_image_url?: string | null
          remaining_amount?: number | null
          remaining_payment_id?: string | null
          service_description?: string | null
          service_listing_id?: string | null
          service_title?: string
          special_requirements?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
          venue_address?: string | null
          venue_coordinates?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_verified: boolean | null
          otp_code: string
          phone: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_verified?: boolean | null
          otp_code: string
          phone: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_verified?: boolean | null
          otp_code?: string
          phone?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          payment_method: string
          processed_at: string | null
          qr_code_data: string | null
          qr_payment_reference: string | null
          qr_verified_by: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          refund_amount: number | null
          refund_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_method: string
          processed_at?: string | null
          qr_code_data?: string | null
          qr_payment_reference?: string | null
          qr_verified_by?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_amount?: number | null
          refund_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string
          processed_at?: string | null
          qr_code_data?: string | null
          qr_payment_reference?: string | null
          qr_verified_by?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          refund_amount?: number | null
          refund_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "payment_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      private_theaters: {
        Row: {
          address: string
          admin_notes: string | null
          advance_booking_days: number | null
          allowed_capacity: number | null
          amenities: string[] | null
          approval_status: string | null
          approved_at: string | null
          available_time_slots: Json | null
          booking_duration_hours: number | null
          cancellation_policy: string | null
          capacity: number
          charges_extra_per_person: number | null
          city: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          discounted_hourly_price: number | null
          extra_charges_per_person: number | null
          hourly_rate: number | null
          id: string
          images: string[] | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          original_hourly_price: number | null
          owner_id: string | null
          pin_code: string
          rating: number | null
          rejected_at: string | null
          state: string
          theme_background_image: string | null
          theme_name: string | null
          theme_primary_color: string | null
          theme_secondary_color: string | null
          total_capacity: number | null
          total_reviews: number | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          advance_booking_days?: number | null
          allowed_capacity?: number | null
          amenities?: string[] | null
          approval_status?: string | null
          approved_at?: string | null
          available_time_slots?: Json | null
          booking_duration_hours?: number | null
          cancellation_policy?: string | null
          capacity?: number
          charges_extra_per_person?: number | null
          city: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          discounted_hourly_price?: number | null
          extra_charges_per_person?: number | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          original_hourly_price?: number | null
          owner_id?: string | null
          pin_code: string
          rating?: number | null
          rejected_at?: string | null
          state: string
          theme_background_image?: string | null
          theme_name?: string | null
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          total_capacity?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          advance_booking_days?: number | null
          allowed_capacity?: number | null
          amenities?: string[] | null
          approval_status?: string | null
          approved_at?: string | null
          available_time_slots?: Json | null
          booking_duration_hours?: number | null
          cancellation_policy?: string | null
          capacity?: number
          charges_extra_per_person?: number | null
          city?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          discounted_hourly_price?: number | null
          extra_charges_per_person?: number | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          original_hourly_price?: number | null
          owner_id?: string | null
          pin_code?: string
          rating?: number | null
          rejected_at?: string | null
          state?: string
          theme_background_image?: string | null
          theme_name?: string | null
          theme_primary_color?: string | null
          theme_secondary_color?: string | null
          total_capacity?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          quote: string
          sex: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          quote: string
          sex?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          quote?: string
          sex?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          rating: number
          service_id: string
          updated_at: string
          user_avatar: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          rating: number
          service_id: string
          updated_at?: string
          user_avatar?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          service_id?: string
          updated_at?: string
          user_avatar?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      service_areas: {
        Row: {
          area_name: string
          city: string | null
          coordinates: Json | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          postal_code: string | null
          radius_km: number | null
          state: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          area_name: string
          city?: string | null
          coordinates?: Json | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          postal_code?: string | null
          radius_km?: number | null
          state?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          area_name?: string
          city?: string | null
          coordinates?: Json | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          postal_code?: string | null
          radius_km?: number | null
          state?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_areas_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "service_areas_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      service_coupons: {
        Row: {
          coupon_id: string
          created_at: string | null
          id: string
          service_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string | null
          id?: string
          service_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string | null
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_coupons_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_coupons_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_listings: {
        Row: {
          add_ons: Json | null
          booking_notice: string | null
          category: string | null
          cover_photo: string | null
          created_at: string | null
          customization_available: boolean | null
          customization_note: string | null
          decoration_type: string | null
          description: string | null
          id: string
          inclusions: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          listing_id: string | null
          longitude: number | null
          offer_price: number | null
          offers_count: number | null
          original_price: number | null
          photos: string[] | null
          pincodes: string[] | null
          promotional_tag: string | null
          rating: number | null
          reviews_count: number | null
          service_environment: string[] | null
          setup_time: string | null
          theme_tags: string[] | null
          title: string
          updated_at: string | null
          vendor_id: string | null
          venue_types: string[] | null
          video_url: string | null
        }
        Insert: {
          add_ons?: Json | null
          booking_notice?: string | null
          category?: string | null
          cover_photo?: string | null
          created_at?: string | null
          customization_available?: boolean | null
          customization_note?: string | null
          decoration_type?: string | null
          description?: string | null
          id?: string
          inclusions?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          listing_id?: string | null
          longitude?: number | null
          offer_price?: number | null
          offers_count?: number | null
          original_price?: number | null
          photos?: string[] | null
          pincodes?: string[] | null
          promotional_tag?: string | null
          rating?: number | null
          reviews_count?: number | null
          service_environment?: string[] | null
          setup_time?: string | null
          theme_tags?: string[] | null
          title: string
          updated_at?: string | null
          vendor_id?: string | null
          venue_types?: string[] | null
          video_url?: string | null
        }
        Update: {
          add_ons?: Json | null
          booking_notice?: string | null
          category?: string | null
          cover_photo?: string | null
          created_at?: string | null
          customization_available?: boolean | null
          customization_note?: string | null
          decoration_type?: string | null
          description?: string | null
          id?: string
          inclusions?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          listing_id?: string | null
          longitude?: number | null
          offer_price?: number | null
          offers_count?: number | null
          original_price?: number | null
          photos?: string[] | null
          pincodes?: string[] | null
          promotional_tag?: string | null
          rating?: number | null
          reviews_count?: number | null
          service_environment?: string[] | null
          setup_time?: string | null
          theme_tags?: string[] | null
          title?: string
          updated_at?: string | null
          vendor_id?: string | null
          venue_types?: string[] | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_listings_category"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "service_listings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "service_listings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      special_services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discounted_price: number | null
          duration_minutes: number | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          duration_minutes?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discounted_price?: number | null
          duration_minutes?: number | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "special_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "special_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      theater_bookings: {
        Row: {
          booking_date: string
          booking_status: string | null
          celebration_name: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string | null
          end_time: string
          guest_count: number | null
          id: string
          number_of_people: number | null
          payment_id: string | null
          payment_status: string | null
          special_requests: string | null
          start_time: string
          theater_id: string
          time_slot_id: string
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_status?: string | null
          celebration_name?: string | null
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string | null
          end_time: string
          guest_count?: number | null
          id?: string
          number_of_people?: number | null
          payment_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          start_time: string
          theater_id: string
          time_slot_id: string
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_status?: string | null
          celebration_name?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          end_time?: string
          guest_count?: number | null
          id?: string
          number_of_people?: number | null
          payment_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          start_time?: string
          theater_id?: string
          time_slot_id?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theater_bookings_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "theater_time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      theater_reviews: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string | null
          theater_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          theater_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          theater_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "theater_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "theater_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_reviews_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      theater_screens: {
        Row: {
          allowed_capacity: number | null
          amenities: string[] | null
          capacity: number
          charges_extra_per_person: number | null
          created_at: string | null
          discounted_hourly_price: number | null
          hourly_rate: number
          id: string
          images: string[] | null
          is_active: boolean | null
          original_hourly_price: number | null
          screen_name: string
          screen_number: number
          theater_id: string
          total_capacity: number | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          allowed_capacity?: number | null
          amenities?: string[] | null
          capacity?: number
          charges_extra_per_person?: number | null
          created_at?: string | null
          discounted_hourly_price?: number | null
          hourly_rate?: number
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          original_hourly_price?: number | null
          screen_name: string
          screen_number: number
          theater_id: string
          total_capacity?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          allowed_capacity?: number | null
          amenities?: string[] | null
          capacity?: number
          charges_extra_per_person?: number | null
          created_at?: string | null
          discounted_hourly_price?: number | null
          hourly_rate?: number
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          original_hourly_price?: number | null
          screen_name?: string
          screen_number?: number
          theater_id?: string
          total_capacity?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theater_screens_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      theater_slot_bookings: {
        Row: {
          booking_date: string
          booking_id: string | null
          created_at: string | null
          end_time: string
          id: string
          screen_id: string | null
          slot_price: number
          start_time: string
          status: string | null
          theater_id: string | null
          time_slot_id: string | null
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_id?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          screen_id?: string | null
          slot_price: number
          start_time: string
          status?: string | null
          theater_id?: string | null
          time_slot_id?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_id?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          screen_id?: string | null
          slot_price?: number
          start_time?: string
          status?: string | null
          theater_id?: string | null
          time_slot_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theater_slot_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "theater_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_slot_bookings_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "theater_screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_slot_bookings_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_slot_bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "theater_time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      theater_time_slots: {
        Row: {
          base_price: number | null
          created_at: string | null
          end_time: string
          holiday_multiplier: number | null
          id: string
          is_active: boolean | null
          is_available: boolean | null
          max_duration_hours: number | null
          min_duration_hours: number | null
          price_multiplier: number | null
          price_per_hour: number | null
          screen_id: string | null
          slot_date: string
          start_time: string
          theater_id: string
          updated_at: string | null
          weekday_multiplier: number | null
          weekend_multiplier: number | null
        }
        Insert: {
          base_price?: number | null
          created_at?: string | null
          end_time: string
          holiday_multiplier?: number | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          max_duration_hours?: number | null
          min_duration_hours?: number | null
          price_multiplier?: number | null
          price_per_hour?: number | null
          screen_id?: string | null
          slot_date: string
          start_time: string
          theater_id: string
          updated_at?: string | null
          weekday_multiplier?: number | null
          weekend_multiplier?: number | null
        }
        Update: {
          base_price?: number | null
          created_at?: string | null
          end_time?: string
          holiday_multiplier?: number | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          max_duration_hours?: number | null
          min_duration_hours?: number | null
          price_multiplier?: number | null
          price_per_hour?: number | null
          screen_id?: string | null
          slot_date?: string
          start_time?: string
          theater_id?: string
          updated_at?: string | null
          weekday_multiplier?: number | null
          weekend_multiplier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "theater_time_slots_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "theater_screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theater_time_slots_theater_id_fkey"
            columns: ["theater_id"]
            isOneToOne: false
            referencedRelation: "private_theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          app_type: string
          auth_user_id: string | null
          bio: string | null
          celebration_date: string | null
          celebration_time: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone_number: string | null
          postal_code: string | null
          profile_image_url: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          app_type: string
          auth_user_id?: string | null
          bio?: string | null
          celebration_date?: string | null
          celebration_time?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone_number?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          app_type?: string
          auth_user_id?: string | null
          bio?: string | null
          celebration_date?: string | null
          celebration_time?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone_number?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          id: string
          notes: string | null
          updated_at: string | null
          vendor_id: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          id?: string
          notes?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          id?: string
          notes?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_inquiry_times: {
        Row: {
          created_at: string | null
          id: string
          inquiry_end_time: string | null
          inquiry_start_time: string
          is_active: boolean | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquiry_end_time?: string | null
          inquiry_start_time: string
          is_active?: boolean | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inquiry_end_time?: string | null
          inquiry_start_time?: string
          is_active?: boolean | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_inquiry_times_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "vendor_inquiry_times_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notifications: {
        Row: {
          action_data: Json | null
          created_at: string | null
          id: string
          image_url: string | null
          is_read: boolean | null
          message: string
          title: string
          type: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          action_data?: Json | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          message: string
          title: string
          type: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          action_data?: Json | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_notifications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "vendor_notifications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_private_details: {
        Row: {
          aadhaar_number: string | null
          bank_account_number: string | null
          bank_ifsc_code: string | null
          created_at: string | null
          gst_number: string | null
          id: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          aadhaar_number?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          created_at?: string | null
          gst_number?: string | null
          id?: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          aadhaar_number?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          created_at?: string | null
          gst_number?: string | null
          id?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_private_details_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "vendor_private_details_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_wallets: {
        Row: {
          available_balance: number
          created_at: string | null
          id: string
          pending_balance: number
          total_earned: number
          total_withdrawn: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          available_balance?: number
          created_at?: string | null
          id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          available_balance?: number
          created_at?: string | null
          id?: string
          pending_balance?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_wallets_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "vendor_wallets_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          auth_user_id: string | null
          availability_schedule: Json | null
          bio: string | null
          business_license_url: string | null
          business_name: string | null
          business_type: string | null
          created_at: string | null
          email: string | null
          experience_years: number | null
          fcm_token: string | null
          full_name: string | null
          id: string
          identity_verification_url: string | null
          is_active: boolean | null
          is_onboarding_completed: boolean | null
          is_online: boolean | null
          is_verified: boolean | null
          latitude: number | null
          location: Json | null
          longitude: number | null
          phone: string | null
          pincode: string | null
          portfolio_images: Json | null
          profile_image_url: string | null
          rating: number | null
          service_area: string | null
          total_jobs_completed: number | null
          total_reviews: number | null
          updated_at: string | null
          vendor_type: string | null
          verification_status: string | null
        }
        Insert: {
          auth_user_id?: string | null
          availability_schedule?: Json | null
          bio?: string | null
          business_license_url?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          fcm_token?: string | null
          full_name?: string | null
          id?: string
          identity_verification_url?: string | null
          is_active?: boolean | null
          is_onboarding_completed?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: Json | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          portfolio_images?: Json | null
          profile_image_url?: string | null
          rating?: number | null
          service_area?: string | null
          total_jobs_completed?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          vendor_type?: string | null
          verification_status?: string | null
        }
        Update: {
          auth_user_id?: string | null
          availability_schedule?: Json | null
          bio?: string | null
          business_license_url?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          fcm_token?: string | null
          full_name?: string | null
          id?: string
          identity_verification_url?: string | null
          is_active?: boolean | null
          is_onboarding_completed?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: Json | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          portfolio_images?: Json | null
          profile_image_url?: string | null
          rating?: number | null
          service_area?: string | null
          total_jobs_completed?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          vendor_type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          status: string | null
          transaction_type: string
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type: string
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          transaction_type?: string
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "wallet_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          total_cashbacks: number | null
          total_refunds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_cashbacks?: number | null
          total_refunds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_cashbacks?: number | null
          total_refunds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          service_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_account_holder_name: string | null
          bank_account_number: string | null
          bank_ifsc_code: string | null
          created_at: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          bank_account_holder_name?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_account_holder_name?: string | null
          bank_account_number?: string | null
          bank_ifsc_code?: string | null
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "withdrawal_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vendor_dashboard_stats: {
        Row: {
          active_theaters: number | null
          completed_orders: number | null
          full_name: string | null
          gross_sales: number | null
          monthly_earnings: number | null
          orders_this_week: number | null
          orders_today: number | null
          pending_orders: number | null
          total_earnings: number | null
          total_orders: number | null
          total_theaters: number | null
          vendor_id: string | null
        }
        Relationships: []
      }
      vendor_pending_orders: {
        Row: {
          booking_date: string | null
          booking_time: string | null
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          days_until_booking: number | null
          id: string | null
          payment_status: string | null
          service_title: string | null
          special_requirements: string | null
          status: string | null
          total_amount: number | null
          urgency_level: string | null
          vendor_id: string | null
          venue_address: string | null
        }
        Insert: {
          booking_date?: string | null
          booking_time?: string | null
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          days_until_booking?: never
          id?: string | null
          payment_status?: string | null
          service_title?: string | null
          special_requirements?: string | null
          status?: string | null
          total_amount?: number | null
          urgency_level?: never
          vendor_id?: string | null
          venue_address?: string | null
        }
        Update: {
          booking_date?: string | null
          booking_time?: string | null
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          days_until_booking?: never
          id?: string | null
          payment_status?: string | null
          service_title?: string | null
          special_requirements?: string | null
          status?: string | null
          total_amount?: number | null
          urgency_level?: never
          vendor_id?: string | null
          venue_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_upcoming_orders: {
        Row: {
          booking_date: string | null
          booking_time: string | null
          created_at: string | null
          customer_name: string | null
          days_until_booking: number | null
          id: string | null
          service_title: string | null
          total_amount: number | null
          vendor_id: string | null
          venue_address: string | null
        }
        Insert: {
          booking_date?: string | null
          booking_time?: string | null
          created_at?: string | null
          customer_name?: string | null
          days_until_booking?: never
          id?: string | null
          service_title?: string | null
          total_amount?: number | null
          vendor_id?: string | null
          venue_address?: string | null
        }
        Update: {
          booking_date?: string | null
          booking_time?: string | null
          created_at?: string | null
          customer_name?: string | null
          days_until_booking?: never
          id?: string | null
          service_title?: string | null
          total_amount?: number | null
          vendor_id?: string | null
          venue_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_dashboard_stats"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_booking: {
        Args: { p_booking_id: string; p_auth_user_id: string }
        Returns: Json
      }
      add_wallet_money: {
        Args: {
          p_vendor_id: string
          p_amount: number
          p_transaction_type: string
          p_description?: string
          p_reference_id?: string
          p_reference_type?: string
          p_status?: string
        }
        Returns: undefined
      }
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      calculate_slot_price: {
        Args: {
          p_theater_id: string
          p_time_slot_id: string
          p_booking_date: string
          p_duration_hours?: number
        }
        Returns: number
      }
      check_vendor_status: {
        Args: { p_auth_user_id: string }
        Returns: Json
      }
      confirm_pending_payment: {
        Args: { p_vendor_id: string; p_amount: number; p_reference_id: string }
        Returns: undefined
      }
      create_user_profile: {
        Args: { user_id: string; app_type: string }
        Returns: undefined
      }
      create_withdrawal_request: {
        Args: {
          p_amount: number
          p_bank_account_number: string
          p_bank_ifsc_code: string
          p_bank_account_holder_name: string
        }
        Returns: string
      }
      cube: {
        Args: { "": number[] } | { "": number }
        Returns: unknown
      }
      cube_dim: {
        Args: { "": unknown }
        Returns: number
      }
      cube_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_is_point: {
        Args: { "": unknown }
        Returns: boolean
      }
      cube_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_send: {
        Args: { "": unknown }
        Returns: string
      }
      cube_size: {
        Args: { "": unknown }
        Returns: number
      }
      earth: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      ensure_admin_profile: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gc_to_sec: {
        Args: { "": number }
        Returns: number
      }
      get_random_quote: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          quote: string
          image_url: string
          sex: string
          created_at: string
          updated_at: string
        }[]
      }
      get_user_app_type: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_profile_safe: {
        Args: { user_id: string }
        Returns: Json
      }
      get_vendor_bank_details: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_vendor_dashboard_stats: {
        Args: { p_auth_user_id: string }
        Returns: Json
      }
      get_vendor_id_for_auth_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_vendor_orders: {
        Args:
          | { p_auth_user_id: string; p_status?: string }
          | { p_status?: string }
        Returns: Json[]
      }
      get_vendor_orders_enhanced: {
        Args: { p_status?: string }
        Returns: Json[]
      }
      get_vendor_wallet: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_wallet_transactions: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Json[]
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      initialize_vendor_wallet: {
        Args: { p_vendor_id: string }
        Returns: undefined
      }
      is_slot_available: {
        Args: {
          p_theater_id: string
          p_time_slot_id: string
          p_booking_date: string
        }
        Returns: boolean
      }
      is_user_vendor: {
        Args: { user_id: string }
        Returns: boolean
      }
      latitude: {
        Args: { "": unknown }
        Returns: number
      }
      longitude: {
        Args: { "": unknown }
        Returns: number
      }
      nearby_theaters: {
        Args: { user_lat: number; user_lng: number; radius_km?: number }
        Returns: {
          id: string
          name: string
          description: string
          address: string
          city: string
          state: string
          pin_code: string
          latitude: number
          longitude: number
          capacity: number
          amenities: string[]
          images: string[]
          hourly_rate: number
          rating: number
          total_reviews: number
          is_active: boolean
          owner_id: string
          created_at: string
          updated_at: string
          distance_km: number
        }[]
      }
      sec_to_gc: {
        Args: { "": number }
        Returns: number
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      update_booking_status: {
        Args: { p_booking_id: string; p_new_status: string }
        Returns: undefined
      }
      update_wallet_balance: {
        Args: { user_id: string; amount: number }
        Returns: undefined
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      address_type: "home" | "work" | "hotel" | "other"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      address_type: ["home", "work", "hotel", "other"],
    },
  },
} as const
