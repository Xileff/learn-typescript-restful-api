import { NextFunction, Response } from 'express';
import { UserRequest } from '../type/user-request';
import { CreateContactRequest } from '../model/contact-model';
import { ContactService } from '../service/contact-service';

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as CreateContactRequest;
      const result = await ContactService.create(req.user!, request);
      res.status(201).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      const result = await ContactService.get(req.user!, contactId);
      res.status(200).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
