import { gql } from '@apollo/client';

export const PRODUCT_QUANTITY= gql`
mutation updateProductQuantity($id: String!, $quantity:Float!) 
{
updateProductQuantity(id:$id,quantity:$quantity)
}
`