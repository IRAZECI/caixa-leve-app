import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// ✅ IMPORTS (Caminho ./src)
import { PRODUCTS } from './src/constants/products';
import { ProductCard } from './src/components/ProductCard';
import { CartProvider, useCart } from './src/context/CartContext';
import { SummaryFooter } from './src/components/SummaryFooter';
import { AdminScreen } from './src/screens/AdminScreen';

// --- Configuração das Categorias para o Filtro ---
const CATEGORIES = [
  { id: 'all', label: 'Todos', color: '#374151' },       // Cinza Escuro
  { id: 'acai', label: 'Açaí', color: '#6b21a8' },       // Roxo
  { id: 'doces', label: 'Doces', color: '#f97316' },     // Laranja
  // ✅ ATUALIZADO: Nome mudou, mas o ID continua 'salgados' para manter a cor Verde
  { id: 'salgados', label: 'Salgados e Balas', color: '#16a34a' }, 
  { id: 'bebidas', label: 'Bebidas', color: '#2563eb' }   // Azul
];

// --- Tela de Vendas (Home) ---
function SalesScreen({ navigation }: any) {
  const { addToCart } = useCart();
  
  // Estado para controlar qual filtro está ativo (começa mostrando tudo)
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Lógica de Filtragem: Se for 'all', devolve a lista inteira. Se não, filtra pela categoria.
  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(product => product.category === selectedCategory);

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Caixa Leve 🛒</Text>
        <TouchableOpacity 
          style={styles.adminButton} 
          onPress={() => navigation.navigate('Admin')}
        >
          <Text style={styles.adminButtonText}>Gestão ⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* --- BARRA DE FILTROS --- */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.filterButton,
                  // Se selecionado, fundo colorido. Se não, apenas borda colorida.
                  isSelected ? { backgroundColor: cat.color } : { borderColor: cat.color, borderWidth: 1, backgroundColor: 'transparent' }
                ]}
              >
                <Text style={[
                  styles.filterText,
                  { color: isSelected ? '#FFF' : cat.color }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {/* Lista de Produtos (Filtrada) */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={(p) => addToCart(p)} 
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
      <SummaryFooter />
    </View>
  );
}

// --- Configuração da Navegação ---
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={SalesScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Admin" 
            component={AdminScreen} 
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFF',
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  adminButton: {
    padding: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  adminButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  // Estilos do Filtro
  filterContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    elevation: 2, // Sombra leve
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 12, // Espaço entre os botões
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20, // Redondinho
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Lista
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  }
});