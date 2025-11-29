import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Interfaces para ajudar na organização dos dados
interface SoldItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  totalAmount: number;
  createdAt: any; // Firestore Timestamp
  items: SoldItem[];
}

export function AdminScreen() {
  // Estado da Data Selecionada (Começa com Hoje)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Estados de Dados
  const [loading, setLoading] = useState(true);
  const [totalSold, setTotalSold] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Estado do Modal de Detalhes
  const [showDetails, setShowDetails] = useState(false);

  // Função para mudar a data (+1 dia ou -1 dia)
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // Formata a data para exibir bonito (ex: 28/11/24)
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const fetchSales = async () => {
    setLoading(true);
    try {
      // Define o começo do dia selecionado (00:00:00)
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);

      // Define o fim do dia selecionado (23:59:59)
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Busca no Firebase filtrando pela data
      const q = query(
        collection(db, "transactions"),
        where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
        where("createdAt", "<=", Timestamp.fromDate(endOfDay))
      );

      const querySnapshot = await getDocs(q);
      
      let total = 0;
      const salesList: Transaction[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += data.totalAmount || 0;
        
        // Monta o objeto da venda para a lista detalhada
        salesList.push({
          id: doc.id,
          totalAmount: data.totalAmount,
          createdAt: data.createdAt,
          items: data.items || []
        });
      });

      // Ordena do mais recente para o mais antigo (para não precisar criar índice no Firebase agora)
      // Se der erro de ordenação, o sort resolve no lado do cliente
      salesList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setTransactions(salesList);
      setTotalSold(total);
      setOrderCount(querySnapshot.size);

    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega os dados toda vez que a data muda
  useEffect(() => {
    fetchSales();
  }, [currentDate]);

  return (
    <View style={styles.container}>
      
      {/* --- Navegador de Datas --- */}
      <View style={styles.dateNavigator}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>◀</Text>
        </TouchableOpacity>
        
        <View style={styles.dateDisplay}>
          <Text style={styles.dateLabel}>Movimento de:</Text>
          <Text style={styles.dateValue}>{formatDisplayDate(currentDate)}</Text>
        </View>

        <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* --- Card Principal (Total) - Clicável para abrir detalhes --- */}
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => setShowDetails(true)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Fluxo de Vendas</Text>
          <Text style={styles.clickHint}>(Ver Lista 👆)</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator color="#6b21a8" />
        ) : (
          <Text style={styles.bigNumber}>
            {totalSold.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>Pedidos</Text>
          <Text style={styles.mediumNumber}>{orderCount}</Text>
        </View>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardLabel}>Ticket Médio</Text>
          <Text style={styles.mediumNumber}>
            {orderCount > 0 
              ? (totalSold / orderCount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
              : "R$ 0,00"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchSales}>
        <Text style={styles.refreshText}>🔄 Atualizar Dados</Text>
      </TouchableOpacity>

      {/* --- MODAL: Lista Detalhada de Vendas --- */}
      <Modal
        animationType="slide"
        visible={showDetails}
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Extrato de {formatDisplayDate(currentDate)}</Text>
            <TouchableOpacity onPress={() => setShowDetails(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma venda registrada nesta data.</Text>
            </View>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <View style={styles.transactionCard}>
                  {/* Cabeçalho do Pedido */}
                  <View style={styles.transactionHeader}>
                    <Text style={styles.transactionTime}>
                      🕒 {item.createdAt?.toDate().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                    <Text style={styles.transactionTotal}>
                      {item.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                  </View>
                  
                  <View style={styles.divider} />
                  
                  {/* Lista de Itens do Pedido */}
                  {item.items.map((prod, index) => (
                    <Text key={index} style={styles.productRow}>
                      • {prod.quantity}x {prod.name}
                    </Text>
                  ))}
                </View>
              )}
            />
          )}
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  // Navegação de Data
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    width: 44,
    alignItems: 'center',
  },
  dateButtonText: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
  dateDisplay: { alignItems: 'center' },
  dateLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  dateValue: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },

  // Cards
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardLabel: { fontSize: 14, color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' },
  clickHint: { fontSize: 12, color: '#6b21a8', fontWeight: 'bold' },
  
  bigNumber: { fontSize: 36, fontWeight: 'bold', color: '#10B981' },
  mediumNumber: { fontSize: 24, fontWeight: 'bold', color: '#374151' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfCard: { width: '48%' },

  refreshButton: {
    backgroundColor: '#6b21a8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // Estilos do Modal (Lista)
  modalContainer: { flex: 1, backgroundColor: '#F3F4F6' },
  modalHeader: { 
    padding: 20, 
    paddingTop: 60, // Safe area
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 4
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  closeButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#E5E7EB', borderRadius: 8 },
  closeButtonText: { color: '#374151', fontWeight: 'bold' },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 16 },

  // Cartão de Transação (Item da Lista)
  transactionCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transactionTime: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  transactionTotal: { color: '#10B981', fontWeight: 'bold', fontSize: 18 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  productRow: { fontSize: 15, color: '#374151', marginBottom: 4 },
});