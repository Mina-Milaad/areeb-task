import multer from 'multer'
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/appError.js';




const fileUpload = () => {
  const storage = multer.memoryStorage()

  function fileFilter(req, file, cb) {

    if (file.mimetype.startsWith('image')) {
      cb(null, true)
    } else {
      cb(new AppError('image only', 401), false)
    }


  }

  const upload = multer({
    storage, fileFilter, limits: {
      fileSize: 1 * 1024 * 1024, // 4 MB in bytes
    }
  })

  return upload

}




export const uploadSingleFile = (fieldName) => {

  return fileUpload().single(fieldName)

}





