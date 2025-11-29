import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  Modal,
  ScrollView 
} from 'react-native';
import { useCart } from '../context/CartContext';

export function SummaryFooter() {
  const { cartTotal, cart, finishSale, isLoading, clearCart } = useCart();
  // Estado para controlar se a lista detalhada está visível ou não
  const [showDetails, setShowDetails] = useState(false);

  if (cart.length === 0) return null;

  const handleCancel = () => {
    Alert.alert(
      "Cancelar Venda?",
      "Isso vai apagar todos os itens do carrinho. Tem certeza?",
      [
        { text: "Não", style: "cancel" },
        { text: "Sim, Limpar", style: "destructive", onPress: clearCart }
      ]
    );
  };

  return (
    <>
      <View style={styles.container}>
        {/* Botão Cancelar */}
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>X</Text>
        </TouchableOpacity>

        {/* ✅ AQUI ESTÁ A MUDANÇA: 
            Tornamos a área do Total clicável para abrir o detalhe 
        */}
        <TouchableOpacity 
          style={styles.totalContainer} 
          onPress={() => setShowDetails(true)}
        >
          <Text style={styles.label}>Total (Ver Itens):</Text>
          <Text style={styles.total}>
            {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
          <Text style={styles.hint}>Click para detalhes 👆</Text>
        </TouchableOpacity>

        {/* Botão Confirmar */}
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={finishSale}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>CONFIRMAR</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 🧾 MODAL DE DETALHES (A Comanda)
          Só aparece quando showDetails é true 
      */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetails}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resumo do Pedido 📝</Text>
            
            <ScrollView style={styles.modalList}>
              {cart.map((item) => (
                <View key={item.id} style={styles.modalItem}>
                  <View>
                    <Text style={styles.itemName}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.itemUnit}>
                      {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} un.
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.modalTotalLabel}>Total Final:</Text>
              <Text style={styles.modalTotalValue}>
                {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.closeButtonText}>Fechar Resumo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalContainer: {
    alignItems: 'center',
    // Adicionei uma borda visual pra indicar que é clicável
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', 
    paddingBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  hint: {
    fontSize: 10,
    color: '#6b21a8', // Roxo
    marginTop: 2,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // --- Estilos do Modal (A Comanda) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escuro transparente
    justifyContent: 'flex-end', // Modal vem de baixo
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%', // Ocupa no máximo 70% da tela
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
  },
  modalList: {
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  itemUnit: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  modalTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  modalTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  closeButton: {
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});