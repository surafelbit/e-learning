
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No authorization header found');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            // Verify token with Supabase Auth
            const { data: { user }, error } = await this.supabaseService.getClient().auth.getUser(token);

            if (error || !user) {
                throw new UnauthorizedException('Invalid token');
            }

            request.user = user;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
