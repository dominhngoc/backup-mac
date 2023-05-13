"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var ChangePasswordDialog_1 = require("@common/components/ChangePasswordDialog");
var ConfirmDialog_1 = require("@common/components/ConfirmDialog");
var LoginDialog_1 = require("@common/components/LoginDialog/LoginDialog");
var RequireLoginDialog_1 = require("@common/components/LoginDialog/RequireLoginDialog");
var PackageDataDialog_1 = require("@common/components/PackageDataDialog");
var SnackbarProvider_1 = require("@common/components/SnackbarProvider");
var constant_1 = require("@utility/constant");
var router_1 = require("next/router");
var react_toastify_1 = require("react-toastify");
var Footer_1 = require("./component/Footer");
var Header_1 = require("./component/Header");
var HeaderPolicy_1 = require("./policy/HeaderPolicy");
var listHiddenFooter = [constant_1.ROUTES.shorts.index, constant_1.ROUTES.shorts.hashtags];
var DefaultLayout = function (_a) {
    var children = _a.children;
    var router = router_1.useRouter();
    var hiddenFooter = listHiddenFooter.includes(router.pathname);
    var policyHeader = HeaderPolicy_1.ROUTES_HEADER_POLICY.reduce(function (v, c) {
        return __spreadArrays(v, c.children);
    }, []).includes(router.pathname);
    var studioRoute = Object.values(constant_1.ROUTES.studio).includes(router.pathname);
    return (React.createElement("div", { style: {
            backgroundImage: policyHeader ? 'url("/icons/bg_layout2.png")' : ''
        }, className: "bg-cover bg-center overflow-hidden" },
        policyHeader ? React.createElement(HeaderPolicy_1["default"], null) : studioRoute ? null : React.createElement(Header_1["default"], null),
        children,
        !hiddenFooter && React.createElement(Footer_1["default"], null),
        React.createElement(SnackbarProvider_1["default"], null),
        React.createElement(RequireLoginDialog_1["default"], null),
        React.createElement(LoginDialog_1["default"], null),
        React.createElement(ChangePasswordDialog_1["default"], null),
        React.createElement(PackageDataDialog_1["default"], null),
        React.createElement(ConfirmDialog_1["default"], null),
        React.createElement(react_toastify_1.ToastContainer, { position: "bottom-left", autoClose: 3000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true })));
};
exports["default"] = DefaultLayout;
