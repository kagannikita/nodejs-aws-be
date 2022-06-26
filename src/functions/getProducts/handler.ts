import { middyfy } from '@libs/lambda';
import {client} from "../../db/database";
import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";
import schema from "@functions/getProducts/schema";


const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const internalServerError={
    statusCode: 500,
    body:JSON.stringify('Internal Server Error')
  };
  try {
    await client.connect();

    const query = `select p.id, p.title, p.description, p.price, stocks.count
                  from products as p left outer join stocks
                  on p.id = stocks.product_id;`;
    const result = await client.query(query);
    const { rows } = result;
    return formatJSONResponse(rows)
  } catch (err) {
    console.log('Error during database request executing:', err);
   return internalServerError
  } finally {
    await client.end();
  }
};

export const main = middyfy(getProducts);
