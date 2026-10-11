import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPriceCents: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // Se já existe, incrementa sem ultrapassar o estoque
          if (existingItem.quantity < existingItem.stock) {
            set({
              items: items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            });
          }
        } else {
          // Se é novo e tem estoque, adiciona com quantidade 1
          if (product.stock > 0) {
            set({
              items: [...items, { ...product, quantity: 1 }],
            });
          }
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.id === id) {
              const validatedQuantity = Math.min(quantity, item.stock);
              return { ...item, quantity: validatedQuantity };
            }
            return item;
          }),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPriceCents: () => {
        return get().items.reduce(
          (total, item) => total + item.priceCents * item.quantity,
          0
        );
      },
    }),
    {
      name: "ecommerce-cart", // Chave utilizada no localStorage
    }
  )
);
