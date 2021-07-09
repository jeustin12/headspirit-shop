import { gql } from '@apollo/client';

export const UPDATE_ADDRESS = gql`
  mutation updateAddress($addressInput: AdressUpdateInput!, $id: String!) {
  updateAddress(input: $addressInput, id: $id)
}
`;
export const DELETE_ADDRESS = gql`
  mutation($name: String!) {
    deleteAdressWihtId(name: $name)
  }
`;

export const ADD_ADRESS= gql`
mutation createAdres($input: AdressInput!){
  CreateAdrees(input:$input){
    info
    id
    name
  }
}
`
