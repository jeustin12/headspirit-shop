import React from 'react';
import { SearchBox } from 'components/search-box/search-box';
import { useAppState, useAppDispatch } from 'contexts/app/app.provider';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

interface Props {
  minimal?: boolean;
  showButtonText?: boolean;
  onSubmit?: () => void;
  [key: string]: unknown;
}

const Search: React.FC<Props> = ({ onSubmit, ...props }) => {
  const searchTerm = useAppState('searchTerm');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const intl = useIntl();

  const handleOnChange = (e) => {
    const { value } = e.target;
    dispatch({ type: 'SET_SEARCH_TERM', payload: value });
    dispatch({type:'PASSNAME',payload:''})
  };
  const { pathname, query } = router;
  const onSearch = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
    if (onSubmit) {
      onSubmit();
    }
  };
  return (
    <SearchBox
      onEnter={onSearch}
      onChange={handleOnChange}
      value={searchTerm}
      name="search"
      placeholder={intl.formatMessage({
        id: 'searchPlaceholder',
        defaultMessage: 'Search your products from here',
      })}
      
      buttonText={intl.formatMessage({
        id: 'searchButtonText',
        defaultMessage: 'Search',
      })}
      {...props}
    />
  );
};

export default Search;
