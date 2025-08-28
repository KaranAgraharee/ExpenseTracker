# Contact Section - Expense Tracker

## Overview
The Contact section allows users to view and manage their contacts with detailed expense breakdowns for both group and non-group expenses.

## Features

### 1. Contact Management
- **View Contacts**: See all contacts where you're involved
- **Create Contacts**: Add new contacts by selecting other users
- **Search Contacts**: Filter contacts by name or email
- **Contact Details**: View detailed information about each contact

### 2. Expense Tracking
- **Group Expenses**: Track expenses made within groups
- **Non-Group Expenses**: Track individual expenses between contacts
- **Spending Summary**: View total spending breakdown
- **Real-time Updates**: Expenses are automatically linked to contacts when created

### 3. User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Tabbed Interface**: Switch between group and non-group expenses
- **Visual Indicators**: Color-coded spending summaries
- **Loading States**: Smooth user experience with loading indicators

## API Endpoints

### Backend Routes
- `GET /Home/contacts` - Get all contacts for current user
- `GET /Home/contacts/available-users` - Get users available for contact creation
- `GET /Home/contacts/:contactId` - Get specific contact details with expense breakdown
- `POST /Home/contacts` - Create a new contact
- `PUT /Home/contacts/expenses` - Update contact with new expenses

### Database Models

#### Contact Model
```javascript
{
  Users: [ObjectId], // Array of user IDs in this contact
  GroupExpense: [ObjectId], // Array of group expense IDs
  Non_GroupExpense: [ObjectId], // Array of non-group expense IDs
  totalGroupSpending: Number, // Total amount spent in groups
  totalNonGroupSpending: Number, // Total amount spent outside groups
  lastUpdated: Date // Last time contact was updated
}
```

## How It Works

### 1. Contact Creation
1. User clicks "Add Contact" button
2. System fetches available users (excluding current user)
3. User selects one or more users to create contact with
4. System creates a new contact record linking all selected users

### 2. Expense Linking
1. When an expense is created, the system automatically:
   - Determines if it's a group or non-group expense
   - Finds all contacts that include the expense participants
   - Adds the expense to the appropriate contact's expense arrays
   - Updates spending totals

### 3. Contact Details View
1. User selects a contact from the list
2. System fetches detailed contact information including:
   - Contact members
   - Group expenses with full details
   - Non-group expenses with full details
   - Spending breakdown and totals

## Usage Instructions

### Creating a Contact
1. Navigate to the Contact section
2. Click "Add Contact" button
3. Select users from the available list
4. Click "Create Contact"

### Viewing Contact Details
1. Click on any contact in the list
2. View spending summary in the right panel
3. Switch between "Group Expenses" and "Non-Group Expenses" tabs
4. See detailed expense information including:
   - Item name and price
   - Who paid for it
   - Date and time
   - Group name (for group expenses)

### Searching Contacts
1. Use the search bar to filter contacts
2. Search by contact name or email
3. Results update in real-time

## Technical Implementation

### Frontend (React)
- Uses Redux for state management
- Fetch API for HTTP requests
- Responsive design with Tailwind CSS
- Real-time updates and loading states

### Backend (Node.js/Express)
- MongoDB with Mongoose ODM
- JWT authentication
- Automatic expense linking to contacts
- Populated queries for efficient data fetching

### Database Relationships
- Contacts reference Users (many-to-many)
- Contacts reference Expenses (many-to-many)
- Expenses reference Users and Groups
- Automatic total calculations and updates

## Future Enhancements
- Contact deletion functionality
- Expense filtering and sorting
- Contact categories or tags
- Export contact expense reports
- Push notifications for new expenses
- Contact expense history charts



