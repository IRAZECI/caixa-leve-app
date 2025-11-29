// src/constants/products.ts
import { Product } from "../types";

export const PRODUCTS: Product[] = [
  // Açaís (Roxos)
  { id: '1', name: 'Açaí Trad. 300ml', price: 15.00, category: 'acai' },
  { id: '2', name: 'Açaí Trad. 500ml', price: 20.00, category: 'acai' },
  { id: '3', name: 'Açaí Trad. 700ml', price: 26.00, category: 'acai' },
  
  // Doces (Laranjas)
  { id: '4', name: 'Bombom Unitário', price: 2.50, category: 'doces' },
  { id: '5', name: 'Kit Kat / Snickers', price: 5.00, category: 'doces' },
  { id: '6', name: 'Barra Chocolate', price: 8.00, category: 'doces' },
  { id: '7', name: 'Paçoca Rolha', price: 1.50, category: 'doces' },
  { id: '8', name: 'Bala Fini Peq.', price: 2.50, category: 'doces' },

  //  Salgados e Balas (Verdes)
  { id: '9', name: 'Amendoim Jap. Peq.', price: 3.00, category: 'salgados' },
  { id: '10', name: 'Batata Chips Peq.', price: 5.00, category: 'salgados' },
  { id: '11', name: 'Elma Chips Grande', price: 12.00, category: 'salgados' },
  { id: '18', name: 'Trident Unidade', price: 3.50, category: 'salgados' },
  { id: '19', name: 'Halls Unidade', price: 2.50, category: 'salgados' },
  { id: '20', name: 'Mentos Tubo', price: 4.00, category: 'salgados' },

  // Bebidas (Azuis)
  { id: '12', name: 'Água Mineral 500ml', price: 3.00, category: 'bebidas' },
  { id: '13', name: 'Guaravita', price: 2.00, category: 'bebidas' },
  { id: '14', name: 'Suco de Caixinha', price: 4.00, category: 'bebidas' },
  { id: '15', name: 'Refri Lata 350ml', price: 6.00, category: 'bebidas' },
  { id: '16', name: 'Refri 600ml Garrafa', price: 8.00, category: 'bebidas' },
  { id: '17', name: 'Energético 269ml', price: 12.00, category: 'bebidas' },
];