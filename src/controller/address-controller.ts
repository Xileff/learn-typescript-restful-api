import { Response, NextFunction } from 'express';
import { UserRequest } from '../type/user-request';
import {
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address-model';
import { AddressService } from '../service/address-service';

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateAddressRequest;
      request.contactId = Number(req.params.contactId);
      const result = await AddressService.create(req.user!, request);
      res.status(201).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        addressId: Number(req.params.addressId),
        contactId: Number(req.params.contactId),
      };
      const result = await AddressService.get(req.user!, request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateAddressRequest = req.body as UpdateAddressRequest;
      request.id = Number(req.params.addressId);
      request.contactId = Number(req.params.contactId);
      const result = await AddressService.update(req.user!, request);
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: RemoveAddressRequest = {
        addressId: Number(req.params.addressId),
        contactId: Number(req.params.contactId),
      };
      await AddressService.remove(req.user!, request);
      res.status(200).json({
        data: 'OK',
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      const data = await AddressService.list(req.user!, contactId);
      res.status(200).json({
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}
