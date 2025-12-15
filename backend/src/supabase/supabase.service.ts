
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Hardcoded Supabase values so the app can run without env files.
// TODO: Replace HARDCODED_SUPABASE_SERVICE_ROLE_KEY with your real service_role key from Supabase.
const HARDCODED_SUPABASE_URL = 'https://hnruyktmlqskqqipjcrc.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnV5a3RtbHFza3FxaXBqY3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODkwODksImV4cCI6MjA4MDk2NTA4OX0.LZGoNmAE6qjksg2ugEnVHUdWpNX3k2pngrQ-x-6QZSk';
const HARDCODED_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnV5a3RtbHFza3FxaXBqY3JjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4OTA4OSwiZXhwIjoyMDgwOTY1MDg5fQ.UODVYvapMcDnRn_jwrT68P6xoi8VuPGM4x3JqsV3BfI';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private serviceClient: SupabaseClient; // For admin operations
    private supabaseUrl: string;
    private supabaseAnonKey: string;

    constructor() { }

    onModuleInit() {
        // Use ONLY hardcoded values (no env needed)
        this.supabaseUrl = HARDCODED_SUPABASE_URL;
        const supabaseServiceKey = HARDCODED_SUPABASE_SERVICE_ROLE_KEY;
        this.supabaseAnonKey = HARDCODED_SUPABASE_ANON_KEY;

        if (!this.supabaseUrl || !supabaseServiceKey || !this.supabaseAnonKey) {
            throw new Error('Supabase URL, Service Key, and Anon Key must be hardcoded.');
        }

        // Service role client for admin operations (bypasses RLS)
        this.serviceClient = createClient(this.supabaseUrl, supabaseServiceKey);
    }

    // Get service role client (bypasses RLS - use with caution)
    getServiceClient(): SupabaseClient {
        return this.serviceClient;
    }

    // Get client with user JWT (respects RLS)
    getClientWithAuth(accessToken: string): SupabaseClient {
        return createClient(this.supabaseUrl, this.supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        });
    }

    // Legacy method for backward compatibility
    getClient(): SupabaseClient {
        return this.serviceClient;
    }
}
