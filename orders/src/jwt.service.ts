import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  signPayload(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    console.log("🚀 ~ file: jwt.service.ts:13 ~ JwtAuthService ~ verifyToken ~ token:", token)
    return this.jwtService.verify(token);
  }
}
