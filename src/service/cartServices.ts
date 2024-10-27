import request from "./request";
class CartServices {
  async getListProductInCart() {
    const res = await request.get("/carts");
    return res;
  }

  async removeCartItem(cartItemId: number) {
    try {
      const res = await request.delete(`/carts/${cartItemId}`);
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export const cartServices = new CartServices();
