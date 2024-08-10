import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const clearCart = (callback) => {
        setCartItems([]); // Clear in-memory cart
        localStorage.removeItem('cartItems'); // Remove items from localStorage
        toast.warn("Cart has been cleared!");
        if (callback) callback(); // Execute the callback after clearing the cart
    };

    const addToCart = (product, quantity, onMerchantConflict) => {
        setCartItems(prevItems => {
            if (!product || !product.merchant || !product.merchant.id) {
                toast.error("Failed to add product due to invalid data.");
                return prevItems;
            }

            const existingMerchantId = prevItems.length > 0 ? prevItems[0].merchant.id : null;

            if (existingMerchantId && existingMerchantId !== product.merchant.id) {
                if (onMerchantConflict) {
                    onMerchantConflict(() => {
                        setCartItems([{ ...product, quantity }]); // Clear in-memory cart and add the new product
                        localStorage.setItem('cartItems', JSON.stringify([{ ...product, quantity }])); // Update localStorage with the new item
                        toast.success(`${quantity} of ${product.name} added to cart after clearing the previous items!`);
                    });
                }
                return prevItems; // Return the previous items if the conflict is not resolved
            }

            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                const updatedCart = prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Update localStorage with the updated cart
                toast.info(`Updated quantity of ${product.name} to ${existingItem.quantity + quantity}`);
                console.log(updatedCart);

                return updatedCart;

            } else {
                const updatedCart = [...prevItems, { ...product, quantity }];
                localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Update localStorage with the new cart
                toast.success(`${quantity} of ${product.name} added to cart!`);
                console.log(updatedCart);

                return updatedCart;
            }
        });
    };

    const updateQuantity = (productId, quantity) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
            localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Update localStorage with the updated quantity
            const updatedItem = updatedCart.find(item => item.id === productId);
            toast.info(`Quantity of ${updatedItem.name} updated to ${quantity}`);
            return updatedCart;
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const removedItem = prevItems.find(item => item.id === productId);
            const updatedCart = prevItems.filter(item => item.id !== productId);
            localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Update localStorage with the removed item
            return updatedCart;
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
