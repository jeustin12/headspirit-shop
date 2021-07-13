import { gql } from '@apollo/client';


export const NEW_OR_EXIST_CUSTUMER =gql`
mutation updateOrEliminateCustumer($number:String!,$id:String!,$order:Float!){
  updateOrEliminateCustumer(name:$number,id:$id,order:$order)
}
`