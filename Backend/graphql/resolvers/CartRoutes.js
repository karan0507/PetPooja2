const express = require('express');
const router = express.Router();
const Cart = require('../../models/Cart');

// Add item to cart
router.post('/add-to-cart', async (req, res) => {
  const { userId, productId, name, price, quantity, merchantId, merchantName } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create one
      cart = new Cart({ userId, items: [] });
    }

    const existingMerchantId = cart.items.length > 0 ? cart.items[0].merchant.id.toString() : null;

    // Check if the merchant ID matches
    if (existingMerchantId && existingMerchantId !== merchantId) {
      return res.status(409).json({
        message: 'Merchant conflict. Clear your cart before adding items from a different merchant.',
      });
    }

    // Check if the product already exists in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // If it does, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Otherwise, add the new product
      cart.items.push({ productId, name, price, quantity, merchant: { id: merchantId, name: merchantName } });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear-cart/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
