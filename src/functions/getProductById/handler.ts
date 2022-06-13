import { middyfy } from '@libs/lambda';
import {products} from "../../data/products";
import {AppError} from "@libs/app-error";
import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";
import schema from "@functions/getProducts/schema";


const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({ pathParameters }) => {
    const { productId } = pathParameters;
    const product = products.find(product => product.id === productId);

    if (product) {
        return formatJSONResponse({product})

    }

    throw new AppError('Product not found', 404);
}

export const main = middyfy(getProductsById);
