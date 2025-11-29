export interface Product {
  id: string;
  name: string;
  price: number;
  // ✅ Adicionamos 'bebidas'
  category: 'acai' | 'doces' | 'salgados' | 'bebidas';
}

export interface CartItem extends Product {
  quantity: number;
}