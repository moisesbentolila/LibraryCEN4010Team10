
const localhost = "http://127.0.0.1:8000"

const apiURL = "/api"

export const endpoint = `${localhost}${apiURL}`

export const userIDURL = `${endpoint}/user-id/`
export const countryListURL = `${endpoint}/countries/`
export const ProductListURL = `${endpoint}/products/`
export const ProductDetailURL = id => `${endpoint}/products/${id}/`
export const addToCartURL = `${endpoint}/add-to-cart/`
export const orderSummaryURL = `${endpoint}/order-summary/`
export const orderItemDeleteURL = id => `${endpoint}/order-items/${id}/delete/`
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`
export const checkOutURL = `${endpoint}/checkout/`
export const addCouponURL = `${endpoint}/add-coupon/`
export const addressListURL = `${endpoint}/addresses/`
export const addressCreateURL = `${endpoint}/addresses/create/`

