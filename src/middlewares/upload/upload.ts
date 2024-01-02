import multer from "multer";
import multerS3 from 'multer-s3';
import {S3Client} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, S3_BUCKET_NAME} = process.env;

const awsS3 = new S3Client({
    region: AWS_REGION!,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY!,
        secretAccessKey: AWS_SECRET_KEY!,
    }
});

export default multer({
    storage: multerS3({
        s3: awsS3,
        bucket: S3_BUCKET_NAME!,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            if (path.extname(file.originalname) === '.webm') {
                cb(null, `verifications/${Date.now()}${path.extname(file.originalname)}`);
            } else {
                cb(null, `uploads/${Date.now()}${path.extname(file.originalname)}`);
            }
        },
    })
});