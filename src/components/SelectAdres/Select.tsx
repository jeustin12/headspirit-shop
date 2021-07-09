import React from 'react';
import { Select } from 'baseui/select';
import { CaretDownIcon } from 'assets/icons/CaretDownIcon';

export const getContainerFontStyle = ({ $theme }) => {
  return $theme.typography.fontBold14;
};

export default function CustomSelect(props) {
  return (
    <Select
      overrides={{
        SelectArrow: () => {
          return <CaretDownIcon />;
        },
      }}
      {...props}
    />
  );
}
