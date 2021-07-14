import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import RadioGroup from 'components/radio-group/radio-group';
import RadioCard from 'components/radio-card/radio-card';
import { Button } from 'components/button/button';
import UpdateAddress from 'components/address-card/address-card';
import AddAddress from 'components/address-card/add-address-card';
import { handleModal } from 'features/checkouts/checkout-modal';
import { ProfileContext } from 'contexts/profile/profile.context';
import { useMutation } from '@apollo/client';
import { DELETE_ADDRESS } from 'graphql/mutation/address';
import { CardHeader } from 'components/card-header/card-header';
import { ButtonGroup } from 'components/button-group/button-group';
import { Box } from 'components/box';
import { Plus } from 'assets/icons/PlusMinus';
import { UPDATE_ADDRESS } from 'graphql/mutation/address';

interface Props {
  increment?: boolean;
  icon?: boolean;
  buttonProps?: any;
  flexStart?: boolean;
}

const Address = ({
  increment = false,
  flexStart = false,
  buttonProps = {
    size: 'big',
    variant: 'outlined',
    type: 'button',
    className: 'add-button',
  },
  icon = false,
}: Props) => {
  const [deleteAddressMutation] = useMutation(DELETE_ADDRESS);
  const [EditAdressType]=useMutation(UPDATE_ADDRESS)
  const {
    state: { address },
    dispatch,
  } = useContext(ProfileContext);
  const handleOnDelete = async (item) => {
    dispatch({ type: 'DELETE_ADDRESS', payload: item.id });
    return await deleteAddressMutation({
      variables: 
      { name: item.name },
    });
  };
  const setItemType= (item)=>{
  let pri = address.filter(ele=>ele.type==='primary')
  // console.log(pri.length);
  if (item.type==="secondary") {
    let type = "primary"
    try {
      dispatch({
          type: 'SET_PRIMARY_ADDRESS',
          payload: item.id  
        })
      EditAdressType({
        variables:{ 
          id:item.id,
          addressInput:{
            type:type
          } 
        },
      })
      if (pri.length >= 1) {
        EditAdressType({
          variables:{ 
            id:pri[0].id,
            addressInput:{
              type:"secondary"
            } 
          },
        })
      }
    } catch (error) {
      console.log(error)
    }
  } else{
    console.log('no pasa nada');
  }

  }
  
  return (
    <>
      <CardHeader increment={increment}>
        <FormattedMessage
          id='checkoutDeliveryAddress'
          defaultMessage='Select Your Delivery Address'
        />
      </CardHeader>
      <ButtonGroup flexStart={flexStart}>
        <RadioGroup
          items={address}
          component={(item: any) => (
            <RadioCard
              id={item.id}
              key={item.id}
              title={item.name}
              content={item.info}
              name='address'
              checked={item.type === 'primary'}
              onChange={() =>
                setItemType(item)
              }
              onEdit={() => handleModal(UpdateAddress, item)}
              onDelete={() => handleOnDelete(item)}
            />
          )}
          secondaryComponent={
            <Button
              {...buttonProps}
              onClick={() => handleModal(AddAddress, 'add-address-modal')}
            >
              {icon && (
                <Box mr={2}>
                  <Plus width='10px' />
                </Box>
              )}
              <FormattedMessage
                id='addAddressBtn'
                defaultMessage='Add Address'
              />
            </Button>
          }
        />
      </ButtonGroup>
    </>
  );
};
export default Address;
