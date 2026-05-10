resource "aws_budgets_budget" "monthly_cost_budget" {
  name              = "axentx-monthly-spend-budget"
  budget_type       = "COST"
  time_unit         = "MONTHLY"
  budget_limit {
    amount   = 50.00
    unit     = "USD"
  }
  cost_filters {
    tag_key    = "Environment"
    tag_values = ["production"]
  }
}

resource "aws_budgets_budget_subscription" "monthly_cost_subscription" {
  budget_name = aws_budgets_budget.monthly_cost_budget.name
  subscription_limit {
    amount   = 50.00
    unit     = "USD"
  }
}

resource "aws_budgets_budget_action" "threshold_80" {
  budget_name = aws_budgets_budget.monthly_cost_budget.name
  threshold   = 80
  action {
    action_type = "EMAIL"
    email {
      email_addresses = ["admin@axentx.com"]
      subject         = "AWS Budget Alert: 80% Threshold"
      message         = "Your AWS spending has reached 80% of your monthly budget."
    }
  }
}

resource "aws_budgets_budget_action" "threshold_100" {
  budget_name = aws_budgets_budget.monthly_cost_budget.name
  threshold   = 100
  action {
    action_type = "EMAIL"
    email {
      email_addresses = ["admin@axentx.com"]
      subject         = "AWS Budget Alert: 100% Threshold"
      message         = "Your AWS spending has exceeded your monthly budget."
    }
  }
}