import { AWS } from '../aws-client';
import { getAccountId } from '../utils';

export interface BudgetAlertConfig {
  budgetName: string;
  monthlyLimit: number;
  thresholdPercent: number;
  notificationEmail: string;
}

export interface BudgetStatus {
  budgetName: string;
  currentSpend: number;
  budgetLimit: number;
  alertThreshold: number;
  status: 'ok' | 'warning' | 'exceeded';
  lastUpdated: Date;
}

const DEFAULT_BUDGET_CONFIG = {
  budgetName: 'sandbox-default',
  monthlyLimit: 10,
  thresholdPercent: 80,
} as const;

export async function createBudgetAlert(
  sandboxId: string,
  notificationEmail: string,
  customLimit?: number,
  customThreshold?: number
): Promise<BudgetAlertConfig> {
  const accountId = await getAccountId();
  const budgetName = `sandbox-${sandboxId}-budget`;
  
  const budgetConfig: BudgetAlertConfig = {
    budgetName,
    monthlyLimit: customLimit ?? DEFAULT_BUDGET_CONFIG.monthlyLimit,
    thresholdPercent: customThreshold ?? DEFAULT_BUDGET_CONFIG.thresholdPercent,
    notificationEmail,
  };

  const budgetsClient = new AWS.Budgets();

  try {
    // Create the budget with cost filter for this sandbox
    await budgetsClient.createBudget({
      AccountId: accountId,
      Budget: {
        BudgetName: budgetName,
        BudgetLimit: {
          Amount: budgetConfig.monthlyLimit.toString(),
          Unit: 'USD',
        },
        TimeUnit: 'MONTHLY',
        BudgetType: 'COST',
        CostFilters: {
          TagKey: ['sandbox-id'],
          TagValue: [[sandboxId]],
        },
      },
    });

    // Create notification at configured threshold
    await budgetsClient.createNotification({
      AccountId: accountId,
      BudgetName: budgetName,
      Notification: {
        NotificationType: 'ACTUAL',
        ComparisonOperator: 'GREATER_THAN',
        Threshold: budgetConfig.thresholdPercent,
        ThresholdType: 'PERCENTAGE',
      },
      Subscribers: [
        {
          Address: notificationEmail,
          SubscriptionType: 'EMAIL',
        },
      ],
    });

    return budgetConfig;
  } catch (error) {
    // Provide context for debugging
    throw new Error(`Failed to create budget alert for sandbox ${sandboxId}: ${(error as Error).message}`);
  }
}

export async function getBudgetStatus(sandboxId: string): Promise<BudgetStatus | null> {
  const accountId = await getAccountId();
  const budgetName = `sandbox-${sandboxId}-budget`;
  const budgetsClient = new AWS.Budgets();

  try {
    const result = await budgetsClient.describeBudget({
      AccountId: accountId,
      BudgetName: budgetName,
    });

    if (!result.Budget) {
      return null;
    }

    const budget = result.Budget;
    const limit = parseFloat(budget.BudgetLimit?.Amount || '0');
    const currentSpend = parseFloat(budget.CalculatedSpend?.ActualSpend?.Amount || '0');
    
    // Dynamically get threshold from notifications instead of hardcoding
    let thresholdPercent = DEFAULT_BUDGET_CONFIG.thresholdPercent;
    
    if (budget.NotificationsWithSubscribers && budget.NotificationsWithSubscribers.length > 0) {
      const notification = budget.NotificationsWithSubscribers[0];
      thresholdPercent = notification.Notification?.Threshold ?? DEFAULT_BUDGET_CONFIG.thresholdPercent;
    }

    let status: 'ok' | 'warning' | 'exceeded' = 'ok';
    if (currentSpend >= limit) {
      status = 'exceeded';
    } else if (currentSpend >= limit * (thresholdPercent / 100)) {
      status = 'warning';
    }

    return {
      budgetName,
      currentSpend,
      budgetLimit: limit,
      alertThreshold: thresholdPercent,
      status,
      lastUpdated: new Date(),
    };
  } catch (error) {
    if ((error as any).code === 'NotFoundException') {
      return null;
    }
    throw error;
  }
}

export async function deleteBudgetAlert(sandboxId: string): Promise<void> {
  const accountId = await getAccountId();
  const budgetName = `sandbox-${sandboxId}-budget`;
  const budgetsClient = new AWS.Budgets();

  try {
    await budgetsClient.deleteBudget({
      AccountId: accountId,
      BudgetName: budgetName,
    });
  } catch (error) {
    if ((error as any).code !== 'NotFoundException') {
      throw error;
    }
    // Silently ignore if budget doesn't exist
  }
}