import { SetMetadata } from '@nestjs/common';

// decorate with Public to skip auth guard
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
