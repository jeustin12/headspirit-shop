import React,{useState} from 'react';
import { GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Modal } from '@redq/reuse-modal';
import Carousel from 'components/carousel/carousel';
import { Banner } from 'components/banner/banner';
import { MobileBanner } from 'components/banner/mobile-banner';

import {
  MainContentArea,
  SidebarSection,
  ContentSection,
  OfferSection,
  MobileCarouselDropdown,
} from 'assets/styles/pages.style';
// Static Data Import Here
import { siteOffers } from 'site-settings/site-offers';
import { sitePages } from 'site-settings/site-pages';
import { SEO } from 'components/seo';
import { useRefScroll } from 'utils/use-ref-scroll';
// import { GET_CATEGORIES } from 'graphql/query/category.query';
import { gql,useQuery} from '@apollo/client';
import { ModalProvider } from 'contexts/modal/modal.provider';
const Sidebar = dynamic(() => import('layouts/sidebar/sidebar'));
const Products = dynamic(() =>
  import('components/product-grid/product-list/product-list')
);
const CartPopUp = dynamic(() => import('features/carts/cart-popup'), {
  ssr: false,
});

export const GET_CATEGORIES = gql`
  query getCategories{
    getAllCategories{
      id
      title
      slug
      icon
      type
    children{
      id
      title
    }
    }
  }
`;
const CategoryPage: React.FC<any> = ({ deviceType }) => {
  const { query } = useRouter();
  const [type,setType]=useState('makeup')
  const { data, error, loading} = useQuery(GET_CATEGORIES)
    // ,{
    //   variables:{type}
    // });
    const { elRef: targetRef, scroll } = useRefScroll({
      percentOfElement: 0,
      percentOfContainer: 0,
      offsetPX: -110,
    });
  React.useEffect(() => {
    if (query.text || query.category) {
      scroll();
    }
  }, [query.text, query.category]);
  const PAGE_TYPE: any = 'tienda';
  const page = sitePages[PAGE_TYPE];
  if(loading) return <h1>Cargando...</h1>
  console.log(data);
  
  return (
    <>
      <SEO title={page?.page_title} description={page?.page_description} />
      <ModalProvider>
        <Modal>
          <MobileBanner intlTitleId={page?.banner_title_id} type={PAGE_TYPE} />
          <Banner
            intlTitleId={page?.banner_title_id}
            intlDescriptionId={page?.banner_description_id}
            imageUrl={page?.banner_image_url}
          />
          {/* <OfferSection>
            <div style={{ margin: '0 -10px' }}>
              <Carousel deviceType={deviceType} data={siteOffers} />
            </div>
          </OfferSection> */}
          <MobileCarouselDropdown>
            <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
          </MobileCarouselDropdown>
          <MainContentArea>
            <SidebarSection>
              <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
            </SidebarSection>
            <ContentSection>
              <div ref={targetRef}>
                <Products
                  type={PAGE_TYPE}
                  deviceType={deviceType}
                  fetchLimit={20}
                />
              </div>
            </ContentSection>
          </MainContentArea>
          <CartPopUp deviceType={deviceType} />
        </Modal>
      </ModalProvider> 
    </>
  );
};

export default CategoryPage;
