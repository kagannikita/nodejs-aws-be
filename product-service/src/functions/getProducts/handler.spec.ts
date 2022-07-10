import {getProducts} from "../../mocks/getProducts";
import {products} from "../../data/products";

describe('getProductsList', () => {

    it('should return ProductList object', async () => {
        const actual = await getProducts();
        expect(actual).toEqual({
            products
        });
    });
});
