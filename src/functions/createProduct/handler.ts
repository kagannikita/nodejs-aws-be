import {client} from "../../db/database";
import {middyfy} from "@libs/lambda";
import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";
import schema from "@functions/getProducts/schema";


const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({body}) => {
    const internalServerError={
        statusCode: 500,
        body:JSON.stringify('Internal Server Error')
    };
    let id=null;
    try {
        await client.connect();

        const { title, description, price, count } = body;
        await client.query('BEGIN');
        const queryProduct = {
            text: `insert into products (title, description, price) values
              ($1, $2, $3)  RETURNING id`,
            values: [title, description, price]
        };
        const result=await client.query(queryProduct)
        id=result.rows[0].id;
        const queryStock = {
            text: `insert into stocks (product_id, count) values
              ($1, $2)`,
            values: [id,count]
        };
        await client.query(queryStock);
        await client.query('COMMIT');
        const queryReturn = {
            text: `select p.id, p.title, p.description, p.price, stocks.count
            from products as p left outer join stocks
            on p.id = stocks.product_id where p.id = $1;`,
            values: [id]
        };
        const finalRes=await client.query(queryReturn);
        return formatJSONResponse(finalRes.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.log('Error during database request executing:', err);
        return internalServerError
    } finally {
        await client.end();
    }
}

export const main = middyfy(createProduct);
