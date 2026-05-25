import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('artora_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('artora_cart', JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item) => {
    // Check if duplicate
    const exists = cart.some(cartItem => cartItem.id === item.id);
    if (!exists) {
      setCart(prev => [...prev, item]);
    }
    openCart(); // Premium UX: open drawer immediately upon adding
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Helper: parses price string (e.g. "2.5 ETH", "1200 USD", "$1,500") into value & currency
  const parsePrice = (priceStr) => {
    if (!priceStr || typeof priceStr !== 'string') return { value: 0, currency: 'ETH' };
    
    // Check for Price on Request
    if (priceStr.toLowerCase().includes('request') || priceStr.toLowerCase().includes('exclusive')) {
      return { value: 0, currency: 'ETH', isRequest: true };
    }

    const cleaned = priceStr.replace(/,/g, '');
    const numMatch = cleaned.match(/([\d.]+)/);
    const value = numMatch ? parseFloat(numMatch[1]) : 0;
    
    let currency = 'ETH';
    if (cleaned.toUpperCase().includes('USD') || cleaned.includes('$')) {
      currency = 'USD';
    } else if (cleaned.toUpperCase().includes('ETH') || cleaned.includes('Ξ')) {
      currency = 'ETH';
    }

    return { value, currency };
  };

  // Calculate totals grouped by currency
  const getTotals = () => {
    const totals = {
      ETH: { original: 0, final: 0, savings: 0 },
      USD: { original: 0, final: 0, savings: 0 }
    };

    cart.forEach(item => {
      if (item.itemType === 'package') {
        const orig = parsePrice(item.originalPrice);
        const fin = parsePrice(item.packagePrice);
        
        const currency = fin.currency; // Group by final price currency
        totals[currency].original += orig.value;
        totals[currency].final += fin.value;
        totals[currency].savings += Math.max(0, orig.value - fin.value);
      } else {
        const p = parsePrice(item.price);
        totals[p.currency].original += p.value;
        totals[p.currency].final += p.value;
      }
    });

    return totals;
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotals,
      parsePrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
