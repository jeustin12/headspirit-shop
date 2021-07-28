import React, { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import {
    CartPopupBody,
    PopupHeader,
    PopupItemCount,
    CloseButton,
    PromoCode,
    CheckoutButtonWrapper,
    CheckoutButton,
    Title,
    PriceBox,
    NoProductMsg,
    NoProductImg,
    ItemWrapper,
    CouponBoxWrapper,
    CouponCode,
} from "./cart.style";
import { CloseIcon } from "assets/icons/CloseIcon";
import { ShoppingBagLarge } from "assets/icons/ShoppingBagLarge";
import { NoCartBag } from "assets/icons/NoCartBag";
import { CURRENCY } from "utils/constant";
import { FormattedMessage } from "react-intl";
import { useLocale } from "contexts/language/language.provider";

import { Scrollbar } from "components/scrollbar/scrollbar";
import { useCart } from "contexts/cart/use-cart";
import { CartItem } from "components/cart-item/cart-item";
import Coupon from "features/coupon/coupon";
import Swal from "sweetalert2";

type CartPropsType = {
    style?: any;
    className?: string;
    scrollbarHeight?: string;
    onCloseBtnClick?: (e: any) => void;
};

const Cart: React.FC<CartPropsType> = ({
    style,
    className,
    onCloseBtnClick,
    scrollbarHeight,
}) => {
    const {
        items,
        coupon,
        addItem,
        removeItem,
        removeItemFromCart,
        cartItemsCount,
        itemsCount,
        calculatePrice,
    } = useCart();
    const [hasCoupon, setCoupon] = useState(false);
    const { isRtl } = useLocale();
    const CheckoutFunction = () => {
        if (itemsCount >= 12) {
            Swal.fire({
                title: "Felicidades puedes aplicar para un descuento mayoritario para mas información contactanos por a este número o hablanos a este whatsapp",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si,llevame a whatsapp",
                cancelButtonText:
                    "No, Deseo proceder con la compra a precio regular",
            }).then(async (result) => {
                console.log(result);

                if (result.value) {
                    try {
                        // Swal.fire("Correcto", "success");
                        console.log("esto dirige a whats");
                        if (
                            [
                                "iPad Simulator",
                                "iPhone Simulator",
                                "iPod Simulator",
                                "iPad",
                                "iPhone",
                                "iPod",
                            ].includes(navigator.platform) ||
                            // iPad on iOS 13 detection
                            (navigator.userAgent.includes("Mac") &&
                                "ontouchend" in document)
                        ) {
                            return (window.location.href =
                                "https://api.whatsapp.com/send?phone=+50670230251&text=%20Buenas%20quiero%20hacer%20una%20compra%20mayoritaria");
                        }
                        return window.open(
                            "https://api.whatsapp.com/send?phone=+50670230251&text=%20Buenas%20quiero%20hacer%20una%20compra%20mayoritaria"
                        );
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    onCloseBtnClick;
                    Router.push("/checkout");
                }
            });
        } else {
            onCloseBtnClick;
            Router.push("/checkout");
        }
    };

    return (
        <CartPopupBody className={className} style={style}>
            <PopupHeader>
                <PopupItemCount>
                    <ShoppingBagLarge width="19px" height="24px" />
                    <span>
                        {cartItemsCount}
                        &nbsp;
                        {cartItemsCount > 1 ? (
                            <FormattedMessage
                                id="cartItems"
                                defaultMessage="items"
                            />
                        ) : (
                            <FormattedMessage
                                id="cartItem"
                                defaultMessage="item"
                            />
                        )}
                    </span>
                </PopupItemCount>

                <CloseButton onClick={onCloseBtnClick}>
                    <h6>Seguir Comprando</h6>
                </CloseButton>
            </PopupHeader>

            <Scrollbar className="cart-scrollbar">
                <ItemWrapper className="items-wrapper">
                    {!!cartItemsCount ? (
                        items.map((item) => (
                            <CartItem
                                key={`cartItem-${item.id}`}
                                onIncrement={() => addItem(item)}
                                onDecrement={() => removeItem(item)}
                                onRemove={() => removeItemFromCart(item)}
                                data={item}
                            />
                        ))
                    ) : (
                        <>
                            <NoProductImg>
                                <NoCartBag />
                            </NoProductImg>
                            <NoProductMsg>
                                <FormattedMessage
                                    id="noProductFound"
                                    defaultMessage="No products found"
                                />
                            </NoProductMsg>
                        </>
                    )}
                </ItemWrapper>
            </Scrollbar>

            <CheckoutButtonWrapper>
                <PromoCode>
                    {!coupon?.discountInPercent ? (
                        <>
                            {!hasCoupon ? (
                                <button
                                    onClick={() => setCoupon((prev) => !prev)}
                                >
                                    <FormattedMessage
                                        id="specialCode"
                                        defaultMessage="Have a special code?"
                                    />
                                </button>
                            ) : (
                                <CouponBoxWrapper>
                                    <Coupon
                                        disabled={!items.length}
                                        style={{
                                            boxShadow:
                                                "0 3px 6px rgba(0, 0, 0, 0.06)",
                                        }}
                                    />
                                </CouponBoxWrapper>
                            )}
                        </>
                    ) : (
                        <CouponCode>
                            <FormattedMessage
                                id="couponApplied"
                                defaultMessage="Coupon Applied"
                            />
                            <span>{coupon.code}</span>
                        </CouponCode>
                    )}
                </PromoCode>

                {cartItemsCount !== 0 ? (
                    // <Link href="/checkout">
                    <CheckoutButton
                        onClick={() => {
                            CheckoutFunction();
                        }}
                    >
                        <>
                            <Title>
                                <FormattedMessage
                                    id="nav.checkout"
                                    defaultMessage="Checkout"
                                />
                            </Title>
                            <PriceBox>
                                {CURRENCY}
                                {calculatePrice()}
                            </PriceBox>
                        </>
                    </CheckoutButton>
                ) : (
                    // </Link>
                    <CheckoutButton>
                        <>
                            <Title>
                                <FormattedMessage
                                    id="nav.checkout"
                                    defaultMessage="Checkout"
                                />
                            </Title>
                            <PriceBox>
                                {CURRENCY}
                                {calculatePrice()}
                            </PriceBox>
                        </>
                    </CheckoutButton>
                )}
            </CheckoutButtonWrapper>
        </CartPopupBody>
    );
};

export default Cart;
