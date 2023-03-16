import { UnsupportedMediaTypeException } from '@nestjs/common';

export const imageTypeValidation = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    const err = new UnsupportedMediaTypeException(
      'Only image files are supported',
    );
    return callback(err, false);
  }
  callback(null, true);
};
