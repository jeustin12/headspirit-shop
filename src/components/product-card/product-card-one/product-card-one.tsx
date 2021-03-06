// product card for general
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import Image from "components/image/image";
import { Button } from "components/button/button";
import {
    ProductCardWrapper,
    ProductImageWrapper,
    ProductInfo,
    DiscountPercent,
    ButtonText,
} from "../product-card.style";
import { useCart } from "contexts/cart/use-cart";
import { Counter } from "components/counter/counter";
import { cartAnimation } from "utils/cart-animation";
import { FormattedMessage } from "react-intl";
import { CartIcon } from "assets/icons/CartIcon";
import { useModal } from "contexts/modal/use-modal";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const QuickViewMobile = dynamic(
    () => import("features/quick-view/quick-view-mobile")
);

type ProductCardProps = {
    title: string;
    image: any;
    weight: string;
    currency: string;
    description: string;
    price: number;
    salePrice?: number;
    discountInPercent?: number;
    data: any;
    onChange?: (e: any) => void;
    increment?: (e: any) => void;
    decrement?: (e: any) => void;
    cartProducts?: any;
    addToCart?: any;
    updateCart?: any;
    value?: any;
    deviceType?: any;
    quantity?: any;
    items?: any;
    keys?: any;
};

const ProductCard: React.FC<ProductCardProps> = ({
    title,
    image,
    weight,
    price,
    salePrice,
    discountInPercent,
    cartProducts,
    addToCart,
    updateCart,
    value,
    currency,
    onChange,
    increment,
    decrement,
    data,
    deviceType,
    quantity,
    items,
    keys,
    ...props
}) => {
    const router = useRouter();
    const [showModal, hideModal] = useModal(
        () => (
            <QuickViewMobile
                modalProps={data}
                hideModal={hideModal}
                deviceType={deviceType}
            />
        ),
        {
            onClose: () => {
                const { pathname, query, asPath } = router;
                const as = asPath;
                router.push(
                    {
                        pathname,
                        query,
                    },
                    as,
                    {
                        shallow: true,
                    }
                );
            },
        }
    );
    let item = items.filter((ele) => ele.id === keys);

    const { addItem, removeItem, getItem, isInCart } = useCart();
    const handleAddClick = (e) => {
        e.stopPropagation();
        try {
            if (item[0].quantity + 1 > quantity) {
                return Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "La cantidad de productos deseados supera el inventario disponible",
                    showConfirmButton: true,
                });
            }
            addItem(data);
            if (!isInCart(data.id)) {
                cartAnimation(e);
            }
        } catch (error) {
            addItem(data);
            if (!isInCart(data.id)) {
                cartAnimation(e);
            }
        }
    };
    const handleRemoveClick = (e) => {
        e.stopPropagation();
        removeItem(data);
    };
    const handleQuickViewModal = () => {
        const { pathname, query } = router;
        const as = `/product/${data.slug}`;
        if (pathname === "/product/[slug]") {
            router.push(pathname, as);
            if (typeof window !== "undefined") {
                window.scrollTo(0, 0);
            }
            return;
        }
        showModal();
        router.push(
            {
                pathname,
                query,
            },
            {
                pathname: as,
            },
            {
                shallow: true,
            }
        );
    };
    return (
        <ProductCardWrapper
            onClick={handleQuickViewModal}
            className="product-card"
            style={{
                border: "3px solid #f1f1f1",
            }}
        >
            <ProductImageWrapper>
                <Image
                    url={image}
                    className="product-image"
                    style={{ position: "relative" }}
                    alt={title}
                />
                {discountInPercent ? (
                    <DiscountPercent>{discountInPercent}%</DiscountPercent>
                ) : null}
            </ProductImageWrapper>
            <ProductInfo>
                <h3 className="product-title">{title}</h3>
                <span className="product-weight">{weight}</span>
                <div className="product-meta">
                    <div className="productPriceWrapper">
                        {discountInPercent ? (
                            <span className="discountedPrice">
                                {currency}
                                {price.toLocaleString("en-US")}
                            </span>
                        ) : null}

                        <span className="product-price">
                            {currency}
                            {salePrice
                                ? salePrice.toLocaleString("en-US")
                                : price.toLocaleString("en-US")}
                        </span>
                    </div>

                    {!isInCart(data.id) ? (
                        <Button
                            className="cart-button"
                            variant="secondary"
                            borderRadius={100}
                            onClick={handleAddClick}
                        >
                            <CartIcon mr={2} />
                            <ButtonText>
                                <FormattedMessage
                                    id="addCartButton"
                                    defaultMessage="Cart"
                                />
                            </ButtonText>
                        </Button>
                    ) : (
                        <Counter
                            value={getItem(data.id).quantity}
                            onDecrement={handleRemoveClick}
                            onIncrement={handleAddClick}
                            className="card-counter"
                        />
                    )}
                </div>
            </ProductInfo>
        </ProductCardWrapper>
    );
};

export default ProductCard;
