import React,{useEffect, useState} from 'react';
import { NextPage, GetStaticProps } from 'next';
import { useMutation, useQuery,gql } from '@apollo/client';
import { Modal } from '@redq/reuse-modal';
import { SEO } from 'components/seo';
import Checkout from 'features/checkouts/checkout-two/checkout-two';
import { GET_LOGGED_IN_CUSTOMER } from 'graphql/query/customer.query';

import { ProfileProvider } from 'contexts/profile/profile.provider';
import { initializeApollo } from 'utils/apollo';

const CREATE_CUSTUMER= gql`
mutation CreateCustumer($input: CustumerInput!){
  CreateCustumer(input:$input){
    id
    name
    email
  }
}
`

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  const[custumer,SetCustumer]= useState(true)
  const [Id,setId]=useState('1')
  const[newCustumer,{data}]= useMutation(CREATE_CUSTUMER,
    {
      update: (proxy, mutationResult) => {
        // console.log(mutationResult.data.CreateCustumer.id);
        setId(mutationResult.data.CreateCustumer.id)
      },
      variables:{
        input:{
          name:'prueba',
          email:'guest@guest.com'
          }
      }
    })
  const Me = useQuery(GET_LOGGED_IN_CUSTOMER,{
    variables:{
      id:Id
    }
  })
  if (custumer === true) {
    newCustumer();
    SetCustumer(false)
  }
  if (Me.loading) return <h1>cargando...</h1>
  // console.log(Me.data.me);
  if (Me.error) return <div>{Me.error.message}</div>;
  const token = 'true';
  return (
    <>
      <SEO title="Checkout - HeadSpirit" description="Checkout Details" />
      <ProfileProvider initData={Me.data.me}>
        <Modal>
          <Checkout token={token} deviceType={deviceType} />
        </Modal>
      </ProfileProvider>/
    </> 
  );
};

export default CheckoutPage;
