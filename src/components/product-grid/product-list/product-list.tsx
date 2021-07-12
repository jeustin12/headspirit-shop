import React,{useState} from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
  ProductsRow,
  ProductsCol,
  ButtonWrapper,
  LoaderWrapper,
  LoaderItem,
  ProductCardWrapper,
} from './product-list.style';
import { CURRENCY } from 'utils/constant';
import { useQuery, NetworkStatus } from '@apollo/client';
import Placeholder from 'components/placeholder/placeholder';
import Fade from 'react-reveal/Fade';
import NoResultFound from 'components/no-result/no-result';
import { FormattedMessage } from 'react-intl';
import { Button } from 'components/button/loadmore-button';
import { GET_PRODUCTS } from 'graphql/query/products.query';
import { useAppState } from 'contexts/app/app.provider';

const ErrorMessage = dynamic(() =>
  import('components/error-message/error-message')
);

const GeneralCard = dynamic(
  import('components/product-card/product-card-one/product-card-one')
);
type ProductsProps = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  fetchLimit?: number;
  loadMore?: boolean;
  type?: string;
};
export const Products: React.FC<ProductsProps> = ({
  deviceType,
  fetchLimit = 20,
  loadMore = true,
  type,
}) => {
  const statesubcategory = useAppState('subcategoryname')
  const router = useRouter();
  const { data, error, loading, fetchMore, networkStatus } = useQuery(GET_PRODUCTS,
    {
      variables:{
        subcategory:statesubcategory 
      },
    }
    )
  console.log(statesubcategory);
  
  
  const loadingMore = networkStatus === NetworkStatus.fetchMore;
  
  if (error) return <ErrorMessage message={error.message} />;
  if (loading) {
    return (
      <LoaderWrapper>
        <LoaderItem>
          <Placeholder uniqueKey="1" />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey="2" />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey="3" />
        </LoaderItem>
      </LoaderWrapper>
    );
  }
  
  if (!data || !data.product || data.product.length === 0) {
    return <NoResultFound />;
  }
  // const handleLoadMore = () => {
  //   fetchMore({
  //     variables: {
  //       offset: Number(data.products.items.length),
  //       limit: fetchLimit,
  //     },
  //   });
  // };

  let products = data.product.filter(ele=> ele.quantity > 0) 

  // console.log(products, 'esto');
  const renderCard = (productType, props) => {
        return (
          <GeneralCard
            title={props.name}
            description={props.description}
            image={props.image}
            weight={props.unit}
            currency={CURRENCY}
            price={props.price}
            salePrice={props.salePrice}
            discountInPercent={props.discountInPercent}
            data={props}
            deviceType={deviceType}
            quantity={props.quantity}
          />
        );
        };
        return (
          <>
      <ProductsRow>
        {products.map((item: any, index: number) => (
          <ProductsCol
          key={index}
          style={type === 'book' ? { paddingLeft: 0, paddingRight: 1 } : {}}
          >
            <ProductCardWrapper>
              <Fade
                duration={800}
                delay={index * 10}
                style={{ height: '100%' }}
              >
                {renderCard(type, item)}
              </Fade>
            </ProductCardWrapper>
          </ProductsCol>
        ))}
      </ProductsRow>
      {/* {loadMore && data.products.hasMore && (
        <ButtonWrapper>
          <Button
            onClick={handleLoadMore}
            loading={loadingMore}
            variant="secondary"
            style={{
              fontSize: 14,
            }}
            border="1px solid #f1f1f1"
          >
            <FormattedMessage id="loadMoreButton" defaultMessage="Load More" />
          </Button>
        </ButtonWrapper>
      )} */}
    </>
  );
};
export default Products;
