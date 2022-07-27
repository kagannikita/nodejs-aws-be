import {
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
    S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { middyfy } from '@libs/lambda';
import 'source-map-support/register';
import {AppError} from "@libs/app-error";
import {BUCKET_NAME} from "../../bucket_info/bucket-name";
import {formatJSONResponse} from "@libs/api-gateway";

export const checkIsCsvFile = (filename: string): boolean => {
    const arrNames = filename.split('.');
    return arrNames[arrNames.length - 1] === 'csv';
};

const importProductsFile = async ({
                                      pathParameters,
                                  }) => {

    console.log('filename: ',pathParameters);

    const { filename } = pathParameters;
    if (!checkIsCsvFile(filename)) {
        throw new AppError('Wrong file format', 400);
    }
    const clientParams: S3ClientConfig = {
        region: 'us-east-1',
    };
    const getObjectParams: PutObjectCommandInput = {
        Bucket: BUCKET_NAME,
        Key: `uploaded/${filename}`,
        ContentType: 'text/csv',
    };
    const client = new S3Client(clientParams);
    const command = new PutObjectCommand(getObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 15*60 });
    return formatJSONResponse({ url });
};

export const main = middyfy(importProductsFile);
