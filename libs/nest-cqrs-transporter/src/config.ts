import { SQSTransporter, Transporter } from '@wemaintain/nest-cqrs-transporter/transporters';
import {  Type } from '@nestjs/common';

export class ConfigService {

  public transporters: (Type<Transporter>)[] = [
    SQSTransporter
  ];

}