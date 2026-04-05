# Finance Dashboard UI

A modern, responsive finance dashboard built with React and Tailwind CSS. Track your income, expenses, and gain valuable insights into your spending patterns.

## Features

### Core Features
- Dashboard Overview: Summary cards showing total balance, income, and expenses
- Visualizations: 
  - Balance trend line chart (last 7 days)
  - Spending breakdown pie chart by category
  - Monthly income vs expenses bar chart
- Transactions Management: 
  - List all transactions with details
  - Search, filter by category/type
  - Sort by date or amount
- Role-Based UI: 
  - Viewer role: Can only view data
  - Admin role: Can add, edit, and delete transactions
- Insights Section: 
  - Highest spending category
  - Monthly expense change percentage
  - Average daily spending
  - Savings rate with recommendations
- State Management: Local storage persistence and React hooks
- Responsive Design: Works perfectly on all screen sizes

### Bonus Features
- Dark mode toggle
- Local storage persistence
- Interactive charts with Recharts
- CSV export functionality
- Smooth animations and transitions
- Clean, modern UI with Tailwind CSS

## Tech Stack

- React 18 - UI framework
- Tailwind CSS - Styling
- Recharts - Data visualization
- Lucide React - Icons
- date-fns - Date formatting

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-dashboard
