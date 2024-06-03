import { Response, NextFunction } from 'express';
import { UserRequest } from '../type/user-request';
import { CreateAddressRequest } from '../model/address-model';
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
}
