import {
  HOME_PAGE,
  GROCERY_PAGE,
  TIENDA,
} from 'site-settings/site-navigation';
const arr = [
  HOME_PAGE,
  GROCERY_PAGE,
  TIENDA,
];
export function isCategoryPage(pathname) {
  return arr.includes(`/tienda`);
}
