// src/lib/supabase.ts - SELAH Supabase Configuration
// Technology that breathes with you
// Database connection and client setup

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database table types
export interface Database {
  public: {
    Tables: {
      emails: {
        Row: {
          id: number;
          email: string;
          source: string;
          engagement_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          source?: string;
          engagement_data?: any;
        };
        Update: {
          email?: string;
          source?: string;
          engagement_data?: any;
          updated_at?: string;
        };
      };
      feedback: {
        Row: {
          id: number;
          type: string;
          name: string | null;
          email: string | null;
          subject: string | null;
          message: string;
          source: string;
          metadata: any;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          type?: string;
          name?: string | null;
          email?: string | null;
          subject?: string | null;
          message: string;
          source?: string;
          metadata?: any;
          status?: string;
        };
        Update: {
          type?: string;
          name?: string | null;
          email?: string | null;
          subject?: string | null;
          message?: string;
          source?: string;
          metadata?: any;
          status?: string;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: number;
          session_id: string;
          time_spent: number;
          max_scroll: number;
          breath_interactions: number;
          engagement_data: any;
          created_at: string;
        };
        Insert: {
          session_id: string;
          time_spent?: number;
          max_scroll?: number;
          breath_interactions?: number;
          engagement_data?: any;
        };
      };
      admin_sessions: {
        Row: {
          id: number;
          session_token: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          session_token: string;
          expires_at: string;
        };
      };
    };
  };
}
