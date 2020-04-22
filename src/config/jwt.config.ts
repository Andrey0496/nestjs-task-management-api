import * as config from 'config';

import { JwtModuleOptions } from '@nestjs/jwt';

const jwtConfig = config.get('jwt');

export const jwtConfigOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || jwtConfig.secret,
  signOptions: {
    expiresIn: jwtConfig.expiresIn,
  },
};
