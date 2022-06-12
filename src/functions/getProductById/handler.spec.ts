import {getProductById} from "../../mocks/getProductById";
import {products} from "../../data/products";
import {AppError} from "../../libs/app-error";

describe('getProductById', () => {
    it('should return Product object', async () => {
        const productId = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
        const actual = await getProductById(productId);
        const product = products.find(product => product.id === productId);
        expect(actual).toEqual({
            product
        });
    });

    it('should return AppError object', async () => {
        const productId = '';
        const event = {
            pathParameters: {
                productId
            }
        }
        try {
            await getProductById(event);
        } catch (error) {
            const appError = new AppError('Product not found', 404);
            expect(error).toEqual(appError);
        }
    })
})
