import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    // Lesson 271. ... update the state to add a meal item
    // (11:15) of Lesson 270. Getting Started with Cart Context & Reducer
    // not like this:
    // const existingCartItemIndex = state.items.push(action.item)
    // (13:00) but instead, we use findIndex to check if we already have that item in our item array:
    // return "true" if the id of the item is equal to the item I'm receiving on my action:
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // create a copy of the old array to avoid modifying it and spread the existing items
    const updatedItems = [...state.items];

    // Check if item exists -> findIndex will return -1 if it did not find an item
    // so, if it's greater than -1, we know the item already exists in the items array
    if (existingCartItemIndex > -1) {
      // create a new constant where we create a new array
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        // spread the existing item into this new object and update the exist item quantity
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      // (18:10) We must now re-insert this updated item into our updatedItems array
      // We overwrite the item at that index with the updated item
      // This is how to update the state in an immutable way (without changing the existing state in memory)
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // (15:39) in the case where this item didn't exist in the items array,
      // (15:33) use the new array object (updatedItems) to push the new action item onto it
      // (17:10) explanation of how to manage quantity:
      updatedItems.push({ ...action.item, quantity: 1 });
    }

    // (19:00) we want to return the updated state for this Reducer function:
    return { ...state, items: updatedItems };
  }

  // Lesson 272. Adding a Reusable Modal Component with useEffect
  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    // In contrast to the "ADD item" case, we don't have to check if the item exists
    // If quantity is equal to 1, we want to remove the entire item from the shopping cart,
    // But if it's greater than 1, we want to reduce the quantity
    if (existingCartItem.quantity === 1) {
      // Splice takes an index and the number of items that should be spliced/removed
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      // First, we create a fresh copy of the existing item (updatedItem)
      // And we create a new item based on the old item where we reduce the quantity
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
  // Array destructuing on the useReducer hook to get back our cart state and dispatch function
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
    // The items property should be equal to cart.items, so that whenever the cart state changes,
    // cart.items will also change and the new cartContext will be distributed to all interested Components
    // with the addition of value={cartContext} in the return section below
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
