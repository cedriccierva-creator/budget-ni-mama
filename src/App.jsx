import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Header from './components/Header'
import TransactionsList from './components/TransactionsList'
import BudgetSummary from './components/BudgetSummary'
import TransactionFormModal from './components/TransactionFormModal'
import SettingsModal from './components/SettingsModal'

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsTransactionFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-transparent text-stone-900 dark:text-stone-100">
      <header>
        <Header isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />
      </header>
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <BudgetSummary />
        <TransactionsList
          setIsTransactionFormOpen={setIsTransactionFormOpen}
          onEditTransaction={handleOpenEdit}
        />
        {isTransactionFormOpen && (
          <TransactionFormModal
            key={editingTransaction ? editingTransaction.id : 'new'}
            isOpen={isTransactionFormOpen}
            onClose={handleCloseForm}
            transactionToEdit={editingTransaction}
          />
        )}
        {isSettingsOpen && (
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        )}
      </main>
    </div>
  )
}

export default App
