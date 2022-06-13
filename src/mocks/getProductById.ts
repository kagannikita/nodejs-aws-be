import {products} from "../data/products";

export const getProductById=async(id)=>{
       return {product :products.find((product) => product.id === id)}
}
