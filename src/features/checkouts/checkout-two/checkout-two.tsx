import React, { useContext, useState, useEffect } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { Button } from 'components/button/button';
import { CURRENCY } from 'utils/constant';
import { Scrollbar } from 'components/scrollbar/scrollbar';
import CheckoutWrapper, {
  CheckoutContainer,
  CheckoutInformation,
  InformationBox,
  DeliverySchedule,
  CheckoutSubmit,
  HaveCoupon,
  CouponBoxWrapper,
  CouponInputBox,
  CouponCode,
  RemoveCoupon,
  TermConditionText,
  TermConditionLink,
  CartWrapper,
  CalculationWrapper,
  OrderInfo,
  Title,
  ItemsWrapper,
  Items,
  Quantity,
  Multiplier,
  ItemInfo,
  Price,
  TextWrapper,
  Text,
  TextSinpe,
  TextSinpeInfo,
  Bold,
  Small,
  NoProductMsg,
  NoProductImg,
} from './checkout-two.style';
import { CardHeader } from 'components/card-header/card-header';
import { NoCartBag } from 'assets/icons/NoCartBag';
import Sticky from 'react-stickynode';
import { ProfileContext } from 'contexts/profile/profile.context';
import { FormattedMessage } from 'react-intl';
import { useCart } from 'contexts/cart/use-cart';
import { useLocale } from 'contexts/language/language.provider';
import { useWindowSize } from 'utils/useWindowSize';
import Coupon from 'features/coupon/coupon';
import Address from 'features/address/address';
import Schedules from 'features/schedule/schedule';
import Contact from 'features/contact/contact';
import {gql, useMutation} from '@apollo/client'
import {ADD_ORDER} from '../../../graphql/mutation/order'
import {DELETE_CONTACT} from '../../../graphql/mutation/contact'
import {DELETE_ADDRESS} from '../../../graphql/mutation/address'
import { PRODUCT_QUANTITY } from '../../../graphql/mutation/product';
import Swal from 'sweetalert2'

const CUSTUMER_ORDERS = gql`
mutation custumerOrders($id: String!) {
  UpdateOrderCount(id: $id)
}
`;

// The type of props Checkout Form receives
interface MyFormProps {
  token: string;
  deviceType: any;
}

type CartItemProps = {
  product: any;
};

const OrderItem: React.FC<CartItemProps> = ({ product }) => {
  const { id, quantity, title, name, unit, price, salePrice } = product;
  const displayPrice = salePrice ? salePrice : price;
  return (
    <Items key={id}>
      <Quantity>{quantity}</Quantity>
      <Multiplier>x</Multiplier>
      <ItemInfo>
        {name ? name : title} {unit ? `| ${unit}` : ''}
      </ItemInfo>
      <Price>
        {CURRENCY}
        {(displayPrice * quantity).toFixed(2)}
      </Price>
    </Items>
  );
};

const CheckoutWithSidebar: React.FC<MyFormProps> = ({ token, deviceType }) => {
  const [hasCoupon, setHasCoupon] = useState(false);
  const { state } = useContext(ProfileContext);
  const { isRtl } = useLocale();

  const {
    items,
    removeCoupon,
    coupon,
    clearCart,
    cartItemsCount,
    calculatePrice,
    getExpressPrice,
    calculateDiscount,
    calculateSubTotalPrice,
    isRestaurant,
    toggleRestaurant,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { address, contact, card, schedules} = state;
  const size = useWindowSize();

  const [addOrder]= useMutation(ADD_ORDER)
  const[updateProductQuantity]=useMutation( PRODUCT_QUANTITY)
  useEffect(() => {
    if (
      calculatePrice() > 0 &&
      cartItemsCount > 0 
      ) {
        setIsValid(true);
      }
    }, [state]);
    useEffect(() => {
      return () => {
        if (isRestaurant) {
          toggleRestaurant();
          clearCart();
        }
      };
    }, []);
    
    let entrega = (state.schedules.filter(ele=>ele.type==='primary'))
    let entregaExpress = getExpressPrice()
    const handleSubmit = async () => {
      setLoading(true);
      if (isValid) {
        
        let Num = state.contact.filter(ele=>ele.type==='primary')
        let product= items.map((item) => (
            `${item.name} x${item.quantity}`
            ))
        let ProductID = items.map((item)=>(
          item.id
        ))
        let ProductQuantity = items.map((item)=>(
          item.quantity
        ))
        let tostring= product.toString();
        let address= state.address.filter(ele=>ele.type==='primary')
        let schedule= state.schedules.filter(ele=>ele.type==='primary')
        
        let custumerName= state.address.filter(ele=>ele.type==='primary')
          console.log(address);
          
        const order = {
            custumerName: custumerName[0].name,
            contact:Num[0].number,
            Products: tostring,
            Status: "1 - Pendiente de pago",
            Total_amount: ((entrega[0].title === 'Entega normal') ? calculatePrice():entregaExpress),
            delivery_address: address[0].info,
            custumerId: state.id,
            schedule:schedule[0].title
          }
          addOrder({
              variables:{
                  input: order
                }
              })
          for (let i = 0; i < ProductID.length; i++) {
              updateProductQuantity({
              variables:{
              id:ProductID[i],
              quantity:ProductQuantity[i]
                  }
                })
                }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Tu orden a sido confirmada',
          showConfirmButton: false,
          timer: 1500
        })

        clearCart();
        Router.push('/');
      }
      setLoading(false);
    };
  return (
    <form>
      <CheckoutWrapper>
        <CheckoutContainer>
          <CheckoutInformation>
            {/* DeliveryAddress */}
            <InformationBox>
              <Address
                increment={true}
                flexStart={true}
                buttonProps={{
                  variant: 'text',
                  type: 'button',
                  className: 'addButton',
                }}
                icon={true}
              />
            </InformationBox>

            {/* DeliverySchedule */}
            <InformationBox>
              <DeliverySchedule>
                <Schedules increment={true} />
              </DeliverySchedule>
            </InformationBox>

            {/* Contact number */}
            <InformationBox>
              <Contact
                increment={true}
                flexStart={true}
                buttonProps={{
                  variant: 'text',
                  type: 'button',
                  className: 'addButton',
                }}
                icon={true}
              />
            </InformationBox>
            {/* PaymentOption */}
            <InformationBox>
            <CardHeader increment={true}>
            <FormattedMessage
            id='Metodo de pago'/>
            </CardHeader>
                    <TextWrapper>
                    <TextSinpe>
                      Seleciona tu metodo de pago preferido
                    </TextSinpe>
                    </TextWrapper>
                    <TextWrapper>
                    <TextSinpeInfo>
                    Cuenta a nombre de:<br/>
                    STACY FIORELLA MONGE CORDERO<br/>
                    Número de cuenta IBAN: CR96010200009429659891<br/>
                    Sinpe Movil: 7023-0251<br/>
                    </TextSinpeInfo>
                    </TextWrapper>
            </InformationBox>
            <InformationBox
              className='paymentBox'
              style={{ paddingBottom: 30 }}
            >
              {/* Coupon start */}
              {/* {coupon ? (
                <CouponBoxWrapper>
                  <CouponCode>
                    <FormattedMessage id='couponApplied' />
                    <span>{coupon.code}</span>

                    <RemoveCoupon
                      onClick={(e) => {
                        e.preventDefault();
                        removeCoupon();
                        setHasCoupon(false);
                      }}
                    >
                      <FormattedMessage id='removeCoupon' />
                    </RemoveCoupon>
                  </CouponCode>
                </CouponBoxWrapper>
              ) : (
                <CouponBoxWrapper>
                  {!hasCoupon ? (
                    <HaveCoupon onClick={() => setHasCoupon((prev) => !prev)}>
                      <FormattedMessage
                        id='specialCode'
                        defaultMessage='Have a special code?'
                      />
                    </HaveCoupon>
                  ) : (
                    <CouponInputBox>
                      <Coupon errorMsgFixed={true} className='normalCoupon' />
                    </CouponInputBox>
                  )}
                </CouponBoxWrapper>
              )} */}

              <TermConditionText>
                <FormattedMessage
                  id='termAndConditionHelper'
                  defaultMessage='By making this purchase you agree to our'
                />
                <Link href='#'>
                  <TermConditionLink>
                    <FormattedMessage
                      id='termAndCondition'
                      defaultMessage='terms and conditions.'
                    />
                  </TermConditionLink>
                </Link>
              </TermConditionText>

              {/* CheckoutSubmit */}
              <CheckoutSubmit>
                <Button
                  type='button'
                  onClick={handleSubmit}
                  disabled={!isValid}
                  size='big'
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  <FormattedMessage
                    id='processCheckout'
                    defaultMessage='Proceed to Checkout'
                  />
                </Button>
              </CheckoutSubmit>
            </InformationBox>
          </CheckoutInformation>

          <CartWrapper>
            <Sticky
              enabled={size.width >= 768 ? true : false}
              top={120}
              innerZ={999}
            >
              <OrderInfo>
                <Title>
                  <FormattedMessage
                    id='cartTitle'
                    defaultMessage='Your Order'
                  />
                </Title>

                <Scrollbar className='checkout-scrollbar'>
                  <ItemsWrapper>
                    {cartItemsCount > 0 ? (
                      items.map((item) => (
                        <OrderItem key={`cartItem-${item.id}`} product={item} />
                      ))
                    ) : (
                      <>
                        <NoProductImg>
                          <NoCartBag />
                        </NoProductImg>

                        <NoProductMsg>
                          <FormattedMessage
                            id='noProductFound'
                            defaultMessage='No products found'
                          />
                        </NoProductMsg>
                      </>
                    )}
                  </ItemsWrapper>
                </Scrollbar>

                <CalculationWrapper>
                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id='subTotal'
                        defaultMessage='Subtotal'
                      />
                    </Text>
                    <Text>
                      {CURRENCY}
                      {calculateSubTotalPrice()}
                    </Text>
                  </TextWrapper>

                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id='intlOrderDetailsDelivery'
                        defaultMessage='Delivery Fee'
                      />
                    </Text>
                    {(entrega[0].title === 'Entega normal') ? 
                    <Text>{CURRENCY}0.00</Text>:

                    <Text>{CURRENCY}2000</Text>
                  }
                  </TextWrapper>

                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id='discountText'
                        defaultMessage='Discount'
                      />
                    </Text>
                    <Text>
                      {CURRENCY}
                      {calculateDiscount()}
                    </Text>
                  </TextWrapper>

                  <TextWrapper style={{ marginTop: 20 }}>
                    <Bold>
                      <FormattedMessage id='totalText' defaultMessage='Total' />{' '}
                    </Bold>
                    <Bold>
                      {(entrega[0].title === 'Entega normal')?
                      CURRENCY +
                      calculatePrice()
                      :
                      CURRENCY +
                      entregaExpress
                    }
                    </Bold>
                  </TextWrapper>
                </CalculationWrapper>
              </OrderInfo>
            </Sticky>
          </CartWrapper>
        </CheckoutContainer>
      </CheckoutWrapper>
    </form>
  );
};

export default CheckoutWithSidebar;
