# LibreChat Project Documentation

## Overview
LibreChat adalah platform multimodal AI chat yang dapat dikembangkan menjadi SaaS platform dengan fitur usage tracking, payment gateway, dan admin management.

## Arsitektur Sistem

### Struktur Project
```
LibreChat/
├── api/                    # Backend API
│   ├── models/            # Database models & business logic
│   ├── server/            # Express server, routes, controllers
│   └── db/                # Database connection & schemas
├── client/                # Frontend React application
│   └── src/
│       ├── components/    # UI components
│       └── data-provider/ # API calls & data management
├── packages/              # Shared packages
│   ├── data-provider/     # API service layer
│   └── data-schemas/      # TypeScript schemas & models
└── config/                # Configuration scripts
```

### Database Schema (MongoDB)

#### Core Models
1. **User Model** - User authentication & profile
2. **Conversation Model** - Chat conversations
3. **Message Model** - Individual messages
4. **Transaction Model** - Token usage tracking
5. **Balance Model** - User balance & auto-refill

#### Transaction Schema
```typescript
interface ITransaction {
  user: ObjectId;              // User reference
  conversationId?: string;     // Conversation reference
  tokenType: 'prompt' | 'completion';
  model: string;               // AI model used
  inputTokens?: number;        // Input tokens consumed
  writeTokens?: number;        // Output tokens generated
  readTokens?: number;         // Read tokens (for retrieval)
  createdAt: Date;
}
```

#### Balance Schema
```typescript
interface IBalance {
  user: ObjectId;              // User reference
  tokenCredits: number;        // Available token credits
  autoRefillEnabled: boolean;  // Auto-refill status
  refillIntervalValue?: number;
  refillIntervalUnit?: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  lastRefill?: Date;
  refillAmount?: number;
}
```

## Current Implementation

### Usage Tracking System

#### Backend Implementation
1. **Transaction Model** (`api/models/Transaction.js`)
   - `updateBalance()` - Updates user token balance with concurrency control
   - Handles balance increments/decrements
   - Prevents negative balances
   - Implements retry logic for concurrency conflicts

2. **Token Spending** (`api/models/spendTokens.js`)
   - `spendTokens()` - Records token usage for conversations
   - `spendStructuredTokens()` - Records structured token usage
   - Creates transaction records for audit trail

3. **Balance API** (`api/server/routes/balance.js`)
   - GET `/api/balance` - Retrieves user balance data
   - JWT authentication protected
   - Returns balance info with auto-refill settings

#### Frontend Implementation
1. **Balance Components**
   - `Balance.tsx` - Main balance display component
   - `TokenCreditsItem.tsx` - Token credits display
   - `AutoRefillSettings.tsx` - Auto-refill configuration

2. **Data Provider**
   - `useGetUserBalance()` - React Query hook for balance data
   - Real-time balance updates
   - Automatic refetch on window focus

### API Endpoints

#### Existing Endpoints
- `GET /api/balance` - Get user balance
- `GET /api/user` - Get user profile
- `GET /api/convos` - Get conversations
- `GET /api/messages/:conversationId` - Get messages

#### Required New Endpoints for Usage Logs
- `GET /api/usage/transactions` - Get usage history
- `GET /api/usage/stats` - Get usage statistics
- `GET /api/usage/conversations/:id` - Get conversation usage
- `POST /api/usage/export` - Export usage data

## Implementation Plan

### Phase 1: Enhanced Usage Tracking

#### Backend Changes
1. **New API Endpoints**
   ```javascript
   // api/server/routes/usage.js
   router.get('/transactions', getTransactionHistory);
   router.get('/stats', getUsageStats);
   router.get('/conversations/:id', getConversationUsage);
   router.post('/export', exportUsageData);
   ```

2. **Enhanced Transaction Model**
   - Add conversation-level aggregation
   - Add date range queries
   - Add usage statistics calculations

#### Frontend Changes
1. **Usage Dashboard Components**
   ```
   components/Usage/
   ├── UsageDashboard.tsx     # Main dashboard
   ├── TransactionHistory.tsx # Transaction list
   ├── UsageStats.tsx         # Statistics charts
   └── ConversationUsage.tsx  # Per-conversation usage
   ```

2. **Data Provider Updates**
   ```typescript
   // New hooks
   useGetTransactionHistory()
   useGetUsageStats()
   useGetConversationUsage()
   useExportUsageData()
   ```

### Phase 2: Payment Gateway Integration

#### Payment Provider Integration
1. **Stripe Integration**
   - Payment processing
   - Subscription management
   - Webhook handling

2. **Balance Top-up System**
   - Manual top-up
   - Auto-refill triggers
   - Payment history

#### New Database Models
```typescript
interface IPayment {
  user: ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  stripePaymentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

interface ISubscription {
  user: ObjectId;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeSubscriptionId: string;
}
```

### Phase 3: Admin Features

#### Admin Dashboard
1. **User Management**
   - User list with usage stats
   - Balance management
   - Account suspension/activation

2. **System Monitoring**
   - Usage analytics
   - Revenue tracking
   - Performance metrics

3. **API Key Management**
   - Provider API key rotation
   - Usage limits per key
   - Cost optimization

#### Admin API Endpoints
```javascript
// Admin-only endpoints
GET /api/admin/users          // List all users
GET /api/admin/usage/overview // System usage overview
POST /api/admin/balance/set   // Set user balance
POST /api/admin/users/suspend // Suspend user
```

## Technical Considerations

### Performance
- Implement pagination for transaction history
- Use database indexing for usage queries
- Cache frequently accessed data
- Implement rate limiting

### Security
- JWT authentication for all endpoints
- Role-based access control (RBAC)
- Input validation and sanitization
- Secure payment processing

### Scalability
- Horizontal scaling with load balancers
- Database sharding for large datasets
- CDN for static assets
- Microservices architecture consideration

## Next Steps

1. **Immediate Priority**: Implement usage logs API and UI
2. **Short Term**: Payment gateway integration
3. **Medium Term**: Admin dashboard and user management
4. **Long Term**: Advanced analytics and reporting

This documentation provides the foundation for evolving LibreChat into a comprehensive SaaS multimodal AI platform with robust usage tracking, payment processing, and administrative capabilities.