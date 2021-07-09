import { gql } from '@apollo/client';

// export const ADD_ORDER = gql`
//   mutation($orderInput: String!) {
//     addOrder(orderInput: $orderInput) {
//       id
//       userId
//       products {
//         id
//         title
//       }
//       status
//     }
//   }
// `;


export const ADD_ORDER = gql`
mutation AddOrder($input: OrderInput!) {
  CreateOrder(input: $input) {
    id
    custumerName
    contact
    Products
    Total_amount
    creation_date
  }
}
`;


export const GET_PAYMENT = gql`
  mutation($paymentInput: String!) {
    charge(paymentInput: $paymentInput) {
      status
    }
  }
`;
