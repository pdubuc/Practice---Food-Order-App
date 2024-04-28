import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    // ... update the state to add a meal item
    // (11:15) of Lesson 270. Getting Started with Cart Context & Reducer
    // not like this:
    // const existingCartItemIndex = state.items.push(action.item)
    // (13:00) but instead, we use findIndex to check if we already have that item in our item array:
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // create a copy of the old array to avoid modifying it
    const updatedItems = [...state.items];

    // findIndex will return -1 if it did not find an item (item does not exist):
    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      // if the item does exist in the array, we want to update the quantity property
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      // (18:10) We must now re-insert this updated item into our updatedItems array
      // We overwrite the item at that index with the updated item
      // This is how to update the state in an immutable way (without changing the existing state in memory)
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // (17:10) explanation of how to manage quantity:
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    // (19:00) we want to return the updated state in this Reducer function:
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      // Splice takes an index and the number of items that should be spliced/removed
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      // We create a new item based on the old item where we reduce the quantity
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    // We return a new object that copies in the old state and updates the items:
    return { ...state, items: updatedItems };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

// Above is the Cart logic that we connect to our different Components using this Context:
export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    // (6:53) Lesson 271.  Since we use the same name "item: item", we can use this JS shortcut "item"
    dispatchCartAction({ type: "ADD_ITEM", item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
