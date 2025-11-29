// src/context/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db } from '../config/firebase'; // Importamos a conexão que configuramos
import { Product, CartItem } from '../types';

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
  cartTotal: number;
  finishSale: () => Promise<void>; // Nova função
  isLoading: boolean; // Para travar o botão enquanto envia
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const itemExists = currentCart.find((item) => item.id === product.id);
      if (itemExists) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // A Mágica do Firebase acontece aqui 👇
  const finishSale = async () => {
    if (cart.length === 0) return;

    setIsLoading(true); // Trava o app (loading)

    try {
      // Cria um documento na coleção 'transactions'
      await addDoc(collection(db, "transactions"), {
        items: cart,
        totalAmount: cartTotal,
        createdAt: serverTimestamp(), // O servidor decide a hora exata (mais seguro)
      });

      Alert.alert("Sucesso! 🎉", "Venda registrada na nuvem.");
      clearCart(); // Limpa tudo para o próximo cliente
      
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a venda. Verifique a internet.");
    } finally {
      setIsLoading(false); // Destrava o app
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, cartTotal, finishSale, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);