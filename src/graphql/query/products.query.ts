import { gql } from '@apollo/client';

// export const GET_PRODUCTS = gql`
//   query getProducts {
//   product {
//     id
//     name
//     slug
//     unit
//     price
//     salePrice
//     description
//     discountInPercent
//     type
//     image
//   }
// }
// `;

export const GET_PRODUCTS = gql`
query getProducts($isActive: String!="active",$subcategory: String,$name:String) {
  product(isActive:$isActive,subcategory:$subcategory,name:$name) {
    id
    name
    slug
    unit
    price
    salePrice
    description
    discountInPercent
    type
    image
    quantity
    category
    subcategory

}
}
`;

