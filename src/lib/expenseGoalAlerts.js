import { apiPost } from './api.js';

export const EXPENSE_GOAL_THRESHOLDS = [25, 50, 75, 100];

const pendingNotificationKeys = new Set();

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);
}

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getExpenseGoalUserId(user) {
  return user?._id || user?.id || 'guest';
}

export function getExpenseGoalStorageKey(user, suffix, monthKey = getMonthKey()) {
  return `expenseGoal:${getExpenseGoalUserId(user)}:${monthKey}:${suffix}`;
}

export function isThisMonth(expenseDate) {
  const now = new Date();
  const date = new Date(expenseDate);

  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

export function getThisMonthTotal(expenses) {
  return expenses.reduce((sum, expense) => {
    return isThisMonth(expense.date) ? sum + (Number(expense.amount) || 0) : sum;
  }, 0);
}

export function getSavedMonthlyGoal(user) {
  return Number(localStorage.getItem(getExpenseGoalStorageKey(user, 'amount'))) || 0;
}

function getNotifiedThresholds(user) {
  try {
    const storedThresholds = JSON.parse(
      localStorage.getItem(getExpenseGoalStorageKey(user, 'notified')) || '[]',
    );

    return Array.isArray(storedThresholds) ? storedThresholds : [];
  } catch {
    localStorage.removeItem(getExpenseGoalStorageKey(user, 'notified'));
    return [];
  }
}

function saveNotifiedThresholds(user, thresholds) {
  localStorage.setItem(
    getExpenseGoalStorageKey(user, 'notified'),
    JSON.stringify([...new Set(thresholds)].sort((a, b) => a - b)),
  );
}

function getPendingNotificationKey(user, threshold) {
  return `${getExpenseGoalUserId(user)}:${getMonthKey()}:${threshold}`;
}

export function resetGoalThresholdNotifications(user) {
  localStorage.removeItem(getExpenseGoalStorageKey(user, 'notified'));
}

function getCrossedThresholds(previousTotal, nextTotal, monthlyGoal) {
  if (!monthlyGoal || nextTotal <= 0) return [];

  const previousProgress = (previousTotal / monthlyGoal) * 100;
  const nextProgress = (nextTotal / monthlyGoal) * 100;

  return EXPENSE_GOAL_THRESHOLDS.filter(
    (threshold) => previousProgress < threshold && nextProgress >= threshold,
  );
}

function buildGoalAlert(threshold, monthlyGoal, thisMonthTotal) {
  const isGoalReached = threshold >= 100;
  const title = isGoalReached ? 'Expense goal reached' : `${threshold}% expense goal used`;
  const description = isGoalReached
    ? `You have reached your ${formatCurrency(monthlyGoal)} expense goal for this month.`
    : `This month's expenses are now ${formatCurrency(thisMonthTotal)} of your ${formatCurrency(monthlyGoal)} goal.`;

  return {
    title,
    description,
    isGoalReached,
    threshold,
    monthlyGoal,
    thisMonthTotal,
  };
}

export async function notifyExpenseGoalThresholds({
  user,
  previousTotal = 0,
  nextTotal,
  monthlyGoal = getSavedMonthlyGoal(user),
  onAlert,
  toast,
}) {
  if (!monthlyGoal || !Number.isFinite(nextTotal)) return [];

  const notifiedThresholds = getNotifiedThresholds(user);
  const crossedThresholds = getCrossedThresholds(previousTotal, nextTotal, monthlyGoal);
  const newThresholds = crossedThresholds.filter(
    (threshold) =>
      !notifiedThresholds.includes(threshold) &&
      !pendingNotificationKeys.has(getPendingNotificationKey(user, threshold)),
  );

  if (!newThresholds.length) return [];

  newThresholds.forEach((threshold) => {
    pendingNotificationKeys.add(getPendingNotificationKey(user, threshold));
  });

  const alerts = newThresholds.map((threshold) =>
    buildGoalAlert(threshold, monthlyGoal, nextTotal),
  );
  const latestAlert = alerts.at(-1);

  if (toast) {
    toast({
      title: latestAlert.title,
      description: latestAlert.description,
      variant: latestAlert.isGoalReached ? 'destructive' : 'default',
    });
  }

  if (onAlert) onAlert(latestAlert);

  const emailResults = await Promise.allSettled(
    alerts.map(async (alert) => {
      await apiPost('/expenses/goal-notification', {
        threshold: alert.threshold,
        monthlyGoal: alert.monthlyGoal,
        thisMonthTotal: alert.thisMonthTotal,
      });

      return alert.threshold;
    }),
  );

  const emailedThresholds = emailResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  emailResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        `${alerts[index].threshold}% goal email notification failed:`,
        result.reason?.message || result.reason,
      );
    }
  });

  if (emailedThresholds.length) {
    saveNotifiedThresholds(user, [...notifiedThresholds, ...emailedThresholds]);
  }

  newThresholds.forEach((threshold) => {
    pendingNotificationKeys.delete(getPendingNotificationKey(user, threshold));
  });

  return alerts;
}
