import dotenv from 'dotenv';
import { URL } from 'url';
import {S3} from 'aws-sdk';

dotenv.config();

const {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, S3_BUCKET_NAME} = process.env;

const awsS3 = new S3({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
});

export default async (imageUrl: string) => {
    try {
        const parsedUrl = new URL(imageUrl);
        const objectKey = parsedUrl.pathname.substring(1);
        
        console.log(objectKey);

        return await awsS3.deleteObject({Bucket: S3_BUCKET_NAME!, Key: objectKey}).promise();

    } catch (error) {
        throw new Error("Error deleting object from s3 bucket\n"+error);
    }
}