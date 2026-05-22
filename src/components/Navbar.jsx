import { LogOut, Menu, Moon, Sun, User, Wallet, X } from 'lucide-react';

// Utility to get correct image URL for profile photo
function getPhotoUrl(photo, name = 'User') {
  if (!photo) return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name);
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  const apiBase = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
  return apiBase + photo;
}
import { Button } from '../components/ui/button.jsx';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';


const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/expenses', label: 'Expenses' },
  { path: '/reports', label: 'Reports' },
];

export function Navbar() {
  const { user, logout } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const location = useLocation();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', theme);
  }, [isDarkMode, theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between w-full px-4 md:px-30">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">Expense Tracker</span>
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-1" style={{ paddingLeft: '10em' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
            className="hidden md:inline-flex text-muted-foreground hover:text-foreground"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Link to="/profile" className="hidden md:flex items-center gap-2 text-sm group">
            {user?.photo ? (
              <img
                src={getPhotoUrl(user.photo, user?.name)}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-primary shadow"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
            <span className="text-muted-foreground group-hover:text-primary transition-colors">{user?.name}</span>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="hidden md:flex text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in w-full fixed top-16 inset-x-0 z-50">
          <div className="py-4 space-y-2 w-full px-4 md:px-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}
                {isDarkMode ? 'Light mode' : 'Dark mode'}
              </Button>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                {user?.photo ? (
                  <img
                    src={getPhotoUrl(user.photo, user?.name)}
                    alt="Profile"
                    className="h-7 w-7 rounded-full object-cover border border-primary shadow"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>{user?.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
