import { Navbar } from '../components/Navbar.jsx';
import { ExpenseList } from '../components/ExpenseList.jsx';

export default function Expenses() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 py-6 space-y-6">
        <ExpenseList />
      </main>
    </div>
  );
}