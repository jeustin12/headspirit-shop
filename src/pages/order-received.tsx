import React, { useContext } from 'react';
import { SEO } from 'components/seo';
import OrderReceived from 'features/order-received/order-received';
import { ProfileContext } from 'contexts/profile/profile.context';

const OrderReceivedPage = () => {
  const { state } = useContext(ProfileContext);
  console.log(state)
  return (
    <>
      <SEO title="Invoice - PickBazar" description="Invoice Details" />
      <OrderReceived />
    </>
  );
};

export default OrderReceivedPage;
