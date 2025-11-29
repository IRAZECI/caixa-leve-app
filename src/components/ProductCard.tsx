import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Product } from '../types';

interface Props {
  product: Product;
  onPress: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 24;

export function ProductCard({ product, onPress }: Props) {
  const getBackgroundColor = (category: string) => {
    switch (category) {
      case 'acai': return '#6b21a8';    // Roxo
      case 'doces': return '#f97316';   // Laranja
      case 'salgados': return '#16a34a'; // Verde
      case 'bebidas': return '#2563eb';  //  Azul 
      default: return '#374151';        // Cinza
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getBackgroundColor(product.category) }]} 
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>
        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 120,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'right',
  }
});