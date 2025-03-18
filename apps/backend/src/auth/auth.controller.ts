import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Verify2FADto, RefreshTokenDto, AuthResponseDto, LoginDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { DiscordAuthGuard } from './guards/discord-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { MicrosoftAuthGuard } from './guards/microsoft-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard)
  async protectedRoute(@Request() req) {
    return { message: 'You have access', user: req.user };
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@Request() req) {
    return this.authService.enableTwoFactorAuth(req.user.id);
  }

  @Post('verify-2fa')
  @UseGuards(JwtAuthGuard)
  async verify2FA(@Request() req, @Body() body: Verify2FADto) {
    return this.authService.verifyTwoFactorAuth(body);
  }

  /** 🔹 GOOGLE AUTHENTICATION */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    return { message: 'Redirecting to Google authentication' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req) {
    return this.authService.socialLogin(req.user);
  }

  /** 🔹 DISCORD AUTHENTICATION */
  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  async discordAuth() {
    return { message: 'Redirecting to Discord authentication' };
  }

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  async discordAuthRedirect(@Request() req) {
    return this.authService.socialLogin(req.user);
  }

  /** 🔹 GITHUB AUTHENTICATION */
  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubAuth() {
    return { message: 'Redirecting to GitHub authentication' };
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(@Request() req) {
    return this.authService.socialLogin(req.user);
  }


  /** 🔹 MICROSOFT AUTHENTICATION */
  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftAuth() {
    return { message: 'Redirecting to Microsoft authentication' };
  }

  @Get('microsoft/callback')
  @UseGuards(MicrosoftAuthGuard)
  async microsoftAuthRedirect(@Request() req) {
    return this.authService.socialLogin(req.user);
  }
}