import React, { Fragment } from "react";
import { useTransition, animated } from "react-spring";
import { BaseModal } from "react-spring-modal";
import { CloseIcon } from "assets/icons/CloseIcon";
import { Scrollbar } from "components/scrollbar/scrollbar";

type SpringModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
    style?: any;
};

const CenterModal: React.FC<SpringModalProps> = ({
    isOpen,
    onRequestClose,
    children,
    style = {},
}) => {
    const transition = useTransition(isOpen, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    const staticStyles = {
        padding: 0,
        maxWidth: "calc(100% - 30px)",
        height: "auto",
        maxHeight: "calc(100vh - 30px)",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        display: "flex",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 99999,
    };

    const buttonStyle = {
        width: "200px",
        height: "50px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#B7B7A4",
        borderRadius: "48px",
        color: "#0D1136",
        boxShadow: "none",
        position: "absolute" as "absolute",
        top: "20px",
        left: "35%",
        zIndex: 100000,
        cursor: "pointer",
        padding: 10,
        margin: 275,
        border: 0,
        outline: 0,

        ":focus": {
            outline: 0,
            boxShadow: "none",
        },
    };

    const scrollbarStyle = {
        height: "100%",
        width: "100%",
        // maxHeight: 'calc(100vh - 30px)',
    };

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
            {transition.map(
                ({ item, key, props: transitionStyles }) =>
                    item && (
                        <Fragment key={key}>
                            <animated.div
                                style={{ ...transitionStyles }}
                            ></animated.div>

                            <animated.div
                                key={key}
                                style={{
                                    ...transitionStyles,
                                    ...staticStyles,
                                    ...style,
                                }}
                            >
                                <Scrollbar style={{ ...scrollbarStyle }}>
                                    {children}
                                    <button
                                        type="button"
                                        onClick={onRequestClose}
                                        style={{ ...buttonStyle }}
                                    >
                                        Seguir Comprando
                                        {/* <CloseIcon
                                            style={{ width: 11, height: 11 }}
                                        /> */}
                                    </button>
                                </Scrollbar>
                            </animated.div>
                        </Fragment>
                    )
            )}
        </BaseModal>
    );
};

export default CenterModal;
