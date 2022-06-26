import { middyfy } from '@libs/lambda';
import { client } from 'src/db/database';
import schema from "@functions/getProductById/schema";
import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";




const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({ pathParameters }) => {
    const { productId } = pathParameters;
    const notFoundError = {
        statusCode: 404,
        body: JSON.stringify('Product not found')
    };
    const internalServerError={
        statusCode: 500,
        body:JSON.stringify('Internal Server Error')
    };

    try {
        await client.connect();

        const query = {
            text: `select p.id, p.title, p.description, p.price, stocks.count
            from products as p left outer join stocks
            on p.id = stocks.product_id where p.id = $1;`,
            values: [productId]
        };
        try {
            const result = await client.query(query);
            const { rows } = result;
            if (!rows.length) {
               return notFoundError
            }
            return formatJSONResponse(rows[0]);
        } catch (err) {
            return internalServerError
        }
    } catch (err) {
        console.log('Error during database request executing:', err);
        if (err.message === notFoundError.body) return notFoundError;
        return internalServerError;
    } finally {
        await client.end();
    }
}

export const main = middyfy(getProductsById);
