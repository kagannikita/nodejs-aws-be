import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';


const generatePolicy = (
    principalId: string,
    resource: string,
    effect: 'Deny' | 'Allow',
) => {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: effect,
                    Action: 'execute-api:Invoke',
                    Resource: resource,
                },
            ],
        },
    };
};

const basicAuthorizer: Handler = async (event, _cts, cb) => {
    if (event.type !== 'TOKEN') {
        cb('Unauthorized');
    }

    try {
        const payload = event.authorizationToken.split(' ')[1];
        const decoding = Buffer.from(payload, 'base64').toString('ascii');
        const { kagannikita } = JSON.parse(decoding);
        const effect =
            process.env.kagannikita === kagannikita ? 'Allow' : 'Deny';
        const policy = generatePolicy(payload, event.methodArn, effect);
        cb(null, policy);
    } catch (e) {
        console.log('Error: !!', e.message);

        cb(`Unauthorized: ${e.message}`);
    }
};

export const main = middyfy(basicAuthorizer);
