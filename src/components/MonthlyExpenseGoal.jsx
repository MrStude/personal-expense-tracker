import { useEffect, useState } from 'react';
import { Bell, Target, X } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { useExpenseContext } from '../hooks/useExpenseContext.js';
import { toast } from '../hooks/use-toast.js';
import {
  formatCurrency,
  getExpenseGoalStorageKey,
  getSavedMonthlyGoal,
  getThisMonthTotal,
  notifyExpenseGoalThresholds,
  resetGoalThresholdNotifications,
} from '../lib/expenseGoalAlerts.js';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';

async function showDeviceNotification(title, body) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch (error) {
      console.error('Device notification permission failed:', error.message);
      return;
    }
  }

  if (Notification.permission !== 'granted') return;

  new Notification(title, {
    body,
    icon: '/icon.png',
  });
}

async function requestDeviceNotificationPermission() {
  if (!('Notification' in window) || Notification.permission !== 'default') return;

  try {
    await Notification.requestPermission();
  } catch (error) {
    console.error('Device notification permission failed:', error.message);
  }
}

export function MonthlyExpenseGoal({ className = '', allowEditing = true }) {
  const { expenses } = useExpenseContext();
  const { user } = useAuthContext();
  const goalStorageKey = getExpenseGoalStorageKey(user, 'amount');
  const [savedGoal, setSavedGoal] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);

  const thisMonthTotal = getThisMonthTotal(expenses);
  const monthlyGoal =
    savedGoal?.key === goalStorageKey
      ? savedGoal.amount
      : getSavedMonthlyGoal(user);
  const goalProgress = monthlyGoal > 0 ? (thisMonthTotal / monthlyGoal) * 100 : 0;

  useEffect(() => {
    notifyExpenseGoalThresholds({
      user,
      previousTotal: 0,
      nextTotal: thisMonthTotal,
      monthlyGoal,
      toast,
      onAlert: (alert) => {
        setActiveAlert(alert);
        showDeviceNotification(alert.title, alert.description);
      },
    }).catch((error) => {
      console.error('Goal notification failed:', error.message);
    });
  }, [monthlyGoal, thisMonthTotal, user]);

  function handleGoalSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextGoal = Number(formData.get('monthlyGoal'));

    if (!Number.isFinite(nextGoal) || nextGoal <= 0) {
      toast({
        title: 'Enter a valid goal',
        description: 'Monthly expense goal must be greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem(goalStorageKey, String(nextGoal));
    resetGoalThresholdNotifications(user);
    setSavedGoal({ key: goalStorageKey, amount: nextGoal });
    requestDeviceNotificationPermission();

    toast({
      title: 'Monthly goal saved',
      description: `This month's expense goal is ${formatCurrency(nextGoal)}.`,
    });
  }

  return (
    <div className={`bg-card p-6 rounded-lg border ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Monthly Expense Goal</h3>
          <p className="text-2xl font-bold">{monthlyGoal ? formatCurrency(monthlyGoal) : 'Not set'}</p>
        </div>
        <Target className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>

      {allowEditing && (
        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleGoalSubmit}>
          <Input
            key={goalStorageKey}
            name="monthlyGoal"
            type="number"
            min="1"
            step="1"
            defaultValue={monthlyGoal || ''}
            placeholder="Set this month's goal"
            aria-label="Monthly expense goal"
          />
          <Button type="submit" className="sm:w-28">
            Save
          </Button>
        </form>
      )}

      {monthlyGoal > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between gap-3 text-sm text-muted-foreground">
            <span>{Math.min(goalProgress, 100).toFixed(0)}% used</span>
            <span>{formatCurrency(Math.max(monthlyGoal - thisMonthTotal, 0))} left</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {activeAlert && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 rounded-full p-2 ${
                    activeAlert.isGoalReached
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{activeAlert.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{activeAlert.description}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close goal notification"
                onClick={() => setActiveAlert(null)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
