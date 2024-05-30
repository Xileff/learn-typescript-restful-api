import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest,
  UserResponse,
  toUserResponse,
} from '../model/user-model';
import { UserSchema } from '../validation/user-validation';
import { ValidationHelper } from '../validation/helper';
import { prismaClient } from '../app/database';
import { ResponseError } from '../error/response-error';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = ValidationHelper.validate(
      UserSchema.REGISTER,
      request,
    );

    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername !== 0) {
      throw new ResponseError(400, 'Username already exists');
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prismaClient.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = ValidationHelper.validate(UserSchema.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(401, 'Invalid username or password');
    }

    const isPasswordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new ResponseError(401, 'Invalid username or password');
    }

    user = await prismaClient.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    }); // after update, it will return new user data with token

    const response = toUserResponse(user);
    response.token = user.token!; // can't modify toUserResponse because it's used by register also. therefore we force add the token here

    return response;
  }

  // flow : web.ts -> authMiddleware (give user data) -> controller -> service (receive user data) -> DTO
  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    const updateRequest = ValidationHelper.validate(UserSchema.UPDATE, request);

    const updateData: Partial<User> = {};

    if (updateRequest.name) {
      updateData.name = updateRequest.name;
    }

    if (updateRequest.password) {
      updateData.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await prismaClient.user.update({
      data: updateData,
      where: {
        username: user.username,
      },
    });
    return toUserResponse(result);
  }
}
