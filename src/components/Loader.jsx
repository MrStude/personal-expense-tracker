import { Loader2 } from 'lucide-react';

export function Loader({ size = 'md', text }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-card-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}