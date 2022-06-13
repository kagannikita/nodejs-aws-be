import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import {products} from "../../data/products";

const getProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

  return formatJSONResponse({products});
};

export const main = middyfy(getProducts);
