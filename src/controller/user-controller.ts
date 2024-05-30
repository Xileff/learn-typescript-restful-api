import { Request, Response, NextFunction } from 'express';
import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
} from '../model/user-model';
import { UserService } from '../service/user-service';
import { UserRequest } from '../type/user-request';

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateUserRequest;
      const response = await UserService.register(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginUserRequest;
      const response = await UserService.login(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.get(req.user!); // got req.user from authMiddleware
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const updateUserRequest = req.body as UpdateUserRequest;
      const response = await UserService.update(req.user!, updateUserRequest);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await UserService.logout(req.user!);
      res.status(200).json({
        data: 'OK',
      });
    } catch (e) {
      next(e);
    }
  }
}
