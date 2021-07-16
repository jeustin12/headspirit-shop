import { gql } from '@apollo/client';


export const NEW_OR_EXIST_CUSTUMER =gql`
mutation updateOrEliminateCustumer($number:String!,$id:String!,$order:Float!,$name:String!){
  updateOrEliminateCustumer(name:$name,id:$id,order:$order,number:$number)
}
`