import React, { useContext ,useState} from 'react';
import * as Yup from 'yup';
import { withFormik, FormikProps, Form } from 'formik';
import { closeModal } from '@redq/reuse-modal';
import TextField from 'components/forms/text-field';
import { Button } from 'components/button/button';
import { useMutation,gql,useQuery } from '@apollo/client';
import { ADD_ADRESS } from 'graphql/mutation/address';
import { FieldWrapper, Heading } from './address-card.style';
import { ProfileContext } from 'contexts/profile/profile.context';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select'


const PROVINCES= gql`
query Provinces{
FindAllProvinces{
    id
    name
}
}
`

const CANTONS= gql`
query Cantons($Province:String!){
FindAllCantons(Province:$Province){
    id
    name
}
}
`
const DISTRICTS= gql`
query Districts($Canton: String!, $Province: String!){
FindAllDistricts(Canton:$Canton,Province:$Province){
    id
    name
}
}
`

// Shape of form values
interface FormValues {
id?: number | null;
name?: string;
info?: string;
}
// The type of props MyForm receives
interface MyFormProps {
item?: any | null;
}
// Wrap our form with the using withFormik HoC
const FormEnhancer = withFormik<MyFormProps, FormValues>({
// Transform outer props into form values
mapPropsToValues: (props) => {
    return {
    id: props.item.id || null,
    name: props.item.name || '',
    info: props.item.info || '',
    };
},
validationSchema: Yup.object().shape({
    name: Yup.string().required('Title is required!'),
}),
handleSubmit: (values) => {
    console.log(1);
    // do submitting things
},
});
const AddAddress = (props: FormikProps<FormValues> & MyFormProps) => {
const {
    isValid,
    item,
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleReset,
    isSubmitting,
} = props;
const { state, dispatch } = useContext(ProfileContext);
const provinces = useQuery(PROVINCES)
const [province,SetProvince]=useState('no');
const [canton,SetCanton]=useState('no');
const [district,SetDistrict]=useState('no');
const [info,SetInfo]=useState('no');

const cantons = useQuery(CANTONS,
    {
        variables:{
            Province: ''
        }
    })
const districts = useQuery(DISTRICTS,
    {
        variables:{
            Province:'',
            Canton:''
        }
    })
const [addressMutation, { data }] = useMutation(ADD_ADRESS);
if (provinces.loading) return <h1>Cargando...</h1>
let provincesOptions = provinces.data.FindAllProvinces
const SelectProvince = values => {
    SetProvince(values.name)
    cantons.refetch({
        Province:values.name
    })
}
if (cantons.loading) return <h1>Cargando...</h1>
let cantonsOptions = cantons.data.FindAllCantons
const SelectCanton = values => {
    SetCanton(values.name)
    districts.refetch({
        Province: province,
        Canton: values.name
    })
}

if (districts.loading) return <h1>Cargando...</h1>
let districtsOptions = districts.data.FindAllDistricts
const SelectDistrict = values => {
    SetDistrict(values.name)
}

const handleInfoChange = values=>{
    console.log(values)
    // SetInfo(values)
}

const addressValue = {
    id: values.id,
    type: (state.address.length === 0 ? 'primary' : 'secondary'),
    name: values.name,
    info: province + ',' + canton + ',' + district + ', ' + values.info,
};
const handleSubmits = async () => {
    if (isValid) {
    const addressData = await addressMutation({
        variables: { 
        input:{
            custumerId:state.id,
            name:addressValue.name,
            info:addressValue.info,
            type:addressValue.type
        } 
        },
    });
    console.log(state.id);
    dispatch({ type: 'ADD_OR_UPDATE_ADDRESS', payload: addressValue });
    closeModal();
    }
};
return (
    <Form>
    <Heading>{item && item.id ? 'Edit Address' : 'Añadir dirección '}</Heading>
    <FieldWrapper>
        <TextField
        
        id="name"
        type="text"
        placeholder="Nombre del cliente"
        error={touched.name && errors.name}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        />
    </FieldWrapper>
    <FieldWrapper>
    <Select
    id="province"
    isMulti={false}
    options={provincesOptions}
    //@ts-ignore
    getOptionValue={provincias => provincias.id}
    //@ts-ignore
    getOptionLabel={provincias => provincias.name}
    onChange={option => SelectProvince(option)}
    placeholder='Provincia'
    />
    </FieldWrapper>
    {(province==='no') ? '' :
    <FieldWrapper>
    <Select
    id="Canton"
    isMulti={false}
    options={cantonsOptions}
    //@ts-ignore
    getOptionValue={cantones => cantones.id}
    //@ts-ignore
    getOptionLabel={cantones => cantones.name}
    onChange={option => SelectCanton(option)}
    placeholder='Canton'

    />
    </FieldWrapper>
    }
    {(canton ==='no') ? '' :
    <FieldWrapper>
    <Select
    id="Canton"
    isMulti={false}
    options={districtsOptions}
    //@ts-ignore
    getOptionValue={district => district.id}
    //@ts-ignore
    getOptionLabel={district => district.name}
    onChange={option => SelectDistrict(option)}
    placeholder='Distrito'
    />
    </FieldWrapper>
    }
    <FieldWrapper>
        <TextField
        id="info"
        as="textarea"
        placeholder="Otras Señas"
        error={touched.info && errors.info}
        value={values.info}
        onChange={handleChange}
        onBlur={handleBlur}
        />
    </FieldWrapper>
    <Button
        onClick={handleSubmits}
        type="submit"
        style={{ width: '100%', height: '44px' }}
    >
        <FormattedMessage id="savedAddressId" defaultMessage="Save Address" />
    </Button>
    </Form>
);
};
export default FormEnhancer(AddAddress);
