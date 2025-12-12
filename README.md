# Start Kit - E-Commerce Application

A modern e-commerce application built with React, TanStack Router, and Salesforce Commerce Cloud.

## Overview

This project is a full-featured e-commerce application that demonstrates best practices for integrating TanStack Router with Salesforce Commerce Cloud's SDK. It provides a seamless shopping experience with features like product browsing, search, cart management, checkout, and account management.

## Features

- 🛍️ Product browsing and search
- 🛒 Shopping cart management
- 💳 Secure checkout process
- 👤 User account management
- 📱 Responsive design
- 🔒 Authentication with Salesforce Commerce Cloud
- 🚀 Server-side rendering
- ⚡ Fast client-side navigation

## Tech Stack

- **Frontend Framework**: React 19
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **State Management**: TanStack Query + React Context
- **Styling**: Tailwind CSS + Radix UI
- **E-Commerce Backend**: Salesforce Commerce Cloud
- **API Integration**: commerce-sdk-isomorphic
- **Build Tool**: Vite + Vinxi
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Salesforce Commerce Cloud account with API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd start-kit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Salesforce Commerce Cloud credentials:
   ```
   SFCC_CLIENT_ID=your-client-id
   SFCC_ORG_ID=your-org-id
   SFCC_SHORT_CODE=your-short-code
   SFCC_SITE_ID=your-site-id
   APP_URL=http://localhost:3000
   SESSION_SECRET=your-session-secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Architecture

### Project Structure

```
start-kit/
├── app/                      # Application source code
│   ├── components/           # Reusable UI components
│   │   ├── commerce/         # E-commerce specific components
│   │   ├── magic/           # Animation and interactive components
│   │   └── ui/              # Base UI components
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Third-party integrations
│   │   └── salesforce/      # Salesforce Commerce Cloud integration
│   │       ├── api.ts       # API client wrapper
│   │       ├── client.ts    # Authentication client
│   │       ├── options/     # React Query hooks
│   │       ├── server/      # Server-side functions
│   │       ├── types/       # TypeScript types
│   │       └── ...
│   ├── lib/                 # Utility libraries
│   ├── routes/              # Application routes
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── client.tsx           # Client entry point
│   ├── router.tsx           # Router configuration
│   └── ssr.tsx              # Server-side rendering entry point
├── public/                  # Static assets
├── app.config.ts            # Application configuration
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

### Key Components

#### TanStack Router Integration

The application uses TanStack Router for routing, which provides:

- File-based routing with automatic code splitting
- Type-safe routes and parameters
- Integration with TanStack Query for data fetching
- Server-side rendering support

The router is configured in `app/router.tsx` and integrates with TanStack Query for data management.

#### Salesforce Commerce Cloud Integration

The Salesforce Commerce Cloud integration is structured as follows:

1. **Authentication Client** (`app/integrations/salesforce/client.ts`):
   - Handles authentication with Salesforce Commerce Cloud
   - Manages session tokens and refresh logic
   - Supports guest and customer authentication

2. **API Client** (`app/integrations/salesforce/api.ts`):
   - Provides a wrapper around the commerce-sdk-isomorphic
   - Manages API clients for different Shopper APIs
   - Handles token refreshing and client initialization

3. **Server Functions** (`app/integrations/salesforce/server/`):
   - Implements server-side functions for data fetching and mutations
   - Uses TanStack's `createServerFn` for type-safe API calls
   - Handles error cases and data validation

4. **React Query Hooks** (`app/integrations/salesforce/options/`):
   - Provides React Query hooks for client-side data fetching
   - Implements mutations for data updates
   - Handles query invalidation and caching

## Usage Examples

### Fetching Products

```tsx
// In a route component
import { getProductsQueryOptions } from "@/integrations/salesforce/options/products";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute('/products')({
  component: ProductsPage,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(
      getProductsQueryOptions({ q: "" })
    );
  },
});

function ProductsPage() {
  const { data } = useSuspenseQuery(getProductsQueryOptions({ q: "" }));
  
  return (
    <div>
      <h1>Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {data.hits.map(product => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Adding to Cart

```tsx
// In a component
import { useAddItemToBasketMutation } from "@/integrations/salesforce/options/basket";

function AddToCartButton({ productId, quantity = 1 }) {
  const addToCartMutation = useAddItemToBasketMutation();
  
  const handleAddToCart = () => {
    addToCartMutation.mutate({
      body: [{
        productId,
        quantity
      }]
    });
  };
  
  return (
    <button 
      onClick={handleAddToCart}
      disabled={addToCartMutation.isPending}
    >
      {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Authentication

```tsx
// In a component
import { useSalesforceAuth } from "@/hooks/use-salesforce-auth";

function LoginForm() {
  const { loginMutation } = useSalesforceAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      username: email,
      password
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="Password"
      />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Best Practices

### Performance Optimization

1. **Query Caching**: Use appropriate `staleTime` and `gcTime` settings for queries based on data volatility.

2. **Parallel Requests**: Use `Promise.all` for parallel API requests when possible.

3. **Code Splitting**: Leverage TanStack Router's automatic code splitting to reduce initial bundle size.

4. **Prefetching**: Implement prefetching for critical routes and data to improve perceived performance.

### Error Handling

1. **Global Error Boundary**: The application uses TanStack Router's error boundaries to catch and display errors.

2. **API Error Handling**: Implement specific error handling for different API error types.

3. **Toast Notifications**: Use toast notifications to inform users about success and error states.

### Security

1. **Token Management**: Securely store and refresh authentication tokens.

2. **Input Validation**: Validate all user inputs both client-side and server-side.

3. **HTTPS**: Always use HTTPS for API requests.

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify your Salesforce Commerce Cloud credentials in the `.env` file
   - Check that your API client has the necessary permissions
   - Ensure your session secret is properly configured

2. **API Request Failures**:
   - Check the browser console for detailed error messages
   - Verify that your Salesforce Commerce Cloud instance is accessible
   - Ensure you're using the correct API endpoints and parameters

3. **Build Errors**:
   - Clear the `.vinxi` cache directory
   - Update dependencies to the latest versions
   - Check for TypeScript errors in your codebase

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
