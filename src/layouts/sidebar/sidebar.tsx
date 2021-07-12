import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/client';
import Sticky from 'react-stickynode';
import { Scrollbar } from 'components/scrollbar/scrollbar';
import { useAppDispatch, useAppState } from 'contexts/app/app.provider';
import {
  SidebarMobileLoader,
  SidebarLoader,
} from 'components/placeholder/placeholder';
import {
  CategoryWrapper,
  TreeWrapper,
  PopoverWrapper,
  SidebarWrapper,
  RequestMedicine,
} from './sidebar.style';

import { TreeMenu } from 'components/tree-menu/tree-menu';
import { GET_CATEGORIES } from 'graphql/query/category.query';

import { REQUEST_MEDICINE_MENU_ITEM } from 'site-settings/site-navigation';
import CategoryWalker from 'components/category-walker/category-walker';

type SidebarCategoryProps = {
  deviceType: {
    mobile: string;
    tablet: string;
    desktop: boolean;
  };
  type: string;
};

const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  deviceType: { mobile, tablet, desktop },
  type,
}) => {
  const router = useRouter();
  const { data, loading } = useQuery(GET_CATEGORIES);
  // console.log(data)
  const dispatch = useAppDispatch();
  const { pathname, query } = router;
  const selectedQueries = query.categor;
  const onSubCategoryClick = (title: string) => {
    dispatch({type:'PASSNAME',payload:title})
    console.log('subcategoria');
  };
  const isSidebarSticky = useAppState('isSidebarSticky');

  if (!data || loading) {
    if (mobile || tablet) {
      return <SidebarMobileLoader />;
    }
    return <SidebarLoader />;
  }
  return (
    <CategoryWrapper>
      <PopoverWrapper>
        <CategoryWalker>
          {type === 'medicine' && (
            <Link href={REQUEST_MEDICINE_MENU_ITEM.href}>
              <RequestMedicine>
                <FormattedMessage
                  id={REQUEST_MEDICINE_MENU_ITEM.id}
                  defaultMessage={REQUEST_MEDICINE_MENU_ITEM.defaultMessage}
                />
              </RequestMedicine>
            </Link>
          )}
          {/* <TreeMenu
            data={data.getAllCategories}
            onClick={onCategoryClick}
            active={selectedQueries}
          /> */}
        </CategoryWalker>
      </PopoverWrapper>

      <SidebarWrapper style={{ paddingTop: type === 'medicine' ? 0 : 45 }}>
        <Sticky enabled={isSidebarSticky} top={type === 'medicine' ? 89 : 110}>
          {type === 'medicine' && (
            <Link href={REQUEST_MEDICINE_MENU_ITEM.href}>
              <RequestMedicine>
                <FormattedMessage
                  id={REQUEST_MEDICINE_MENU_ITEM.id}
                  defaultMessage={REQUEST_MEDICINE_MENU_ITEM.defaultMessage}
                />
              </RequestMedicine>
            </Link>
          )}

          <Scrollbar className="sidebar-scrollbar">
            <TreeWrapper>
              <TreeMenu
                data={data.getAllCategories}
                onClick={onSubCategoryClick}
                active={selectedQueries}
              />
            </TreeWrapper>
          </Scrollbar>
        </Sticky>
      </SidebarWrapper>
    </CategoryWrapper>
  );
};

export default SidebarCategory;
