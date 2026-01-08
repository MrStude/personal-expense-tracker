import { Navbar } from '../components/Navbar.jsx';
import { ExpenseList } from '../components/ExpenseList.jsx';

export default function Expenses() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6 lg:py-8">
        <ExpenseList />
      </main>
    </div>
  );
}