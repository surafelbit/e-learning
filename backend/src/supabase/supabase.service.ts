
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private serviceClient: SupabaseClient; // For admin operations
    private supabaseUrl: string;
    private supabaseAnonKey: string;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
        const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';
        this.supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY') || '';

        if (!this.supabaseUrl || !supabaseServiceKey || !this.supabaseAnonKey) {
            throw new Error('Supabase URL, Service Key, and Anon Key must be provided in environment variables');
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
