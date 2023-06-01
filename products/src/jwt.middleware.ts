import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtAuthService: JwtAuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (token) {
      try {
        const payload = await this.jwtAuthService.verifyToken(token);
        req['user'] = payload; // Attach the user object to the request
      } catch (error) {
        res.status(400).json({
          message: 'User not authorized',
        });
        return;
      }
      next();
    }
  }
}
