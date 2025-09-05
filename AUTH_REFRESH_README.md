# Authentication System with Token Refresh

This authentication system now includes automatic token refresh functionality using the endpoint `https://www.arinatouch.com/api/auth/refresh`.

## Features

1. **Automatic Token Refresh**: Tokens are automatically refreshed when they're about to expire (within 5 minutes)
2. **API Interceptors**: All API calls automatically handle token refresh on 401 errors
3. **Manual Refresh**: Components can manually trigger token refresh if needed
4. **Route Protection**: Protected routes check and refresh tokens as needed

## How It Works

### 1. Auth Utilities (`src/utils/auth.js`)

- `refreshToken()`: Makes a POST request to the refresh endpoint
- `isTokenExpiring()`: Checks if a token will expire within a specified time buffer
- `decodeToken()`: Decodes JWT tokens to extract payload information

### 2. API Client (`src/utils/apiClient.js`)

- Axios instance with automatic token attachment
- Response interceptor that handles 401 errors by refreshing tokens
- Automatically retries failed requests with new tokens

### 3. Auth Context (`src/context/AuthContext.jsx`)

- Includes `handleRefreshToken()` and `checkAndRefreshToken()` functions
- Sets up automatic token refresh every 4 minutes
- Provides refresh functions to all components

### 4. Protected Routes (`src/components/ProtectedRoute.jsx`)

- Checks token expiration on route changes
- Triggers refresh if token is expiring

## Usage Examples

### Using the API Client

```jsx
import apiClient from "../utils/apiClient";

// This will automatically handle token refresh if needed
const fetchData = async () => {
  try {
    const response = await apiClient.get("api/some-endpoint");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
  }
};
```

### Manual Token Refresh

```jsx
import { useAuth } from "../context/AuthContext";

const MyComponent = () => {
  const { handleRefreshToken } = useAuth();

  const refreshManually = async () => {
    try {
      await handleRefreshToken();
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };

  return <button onClick={refreshManually}>Refresh Token</button>;
};
```

### Using the Token Refresh Button Component

```jsx
import TokenRefreshButton from "../components/TokenRefreshButton";

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings</h1>
      <TokenRefreshButton />
    </div>
  );
};
```

### Using Auto Token Refresh Hook

```jsx
import { useAutoTokenRefresh } from "../hooks/useAutoTokenRefresh";

const App = () => {
  useAutoTokenRefresh(); // This will automatically refresh tokens

  return <div>{/* Your app content */}</div>;
};
```

## Configuration

The token refresh functionality can be configured by modifying these settings:

1. **Refresh Buffer Time**: Change the buffer time in `isTokenExpiring()` function (default: 5 minutes)
2. **Auto Refresh Interval**: Modify the interval in AuthContext (default: 4 minutes)
3. **API Endpoint**: Update the refresh endpoint URL in `refreshToken()` function

## Error Handling

- If token refresh fails, the user is automatically logged out
- 401 errors trigger automatic token refresh attempts
- Failed refresh attempts clear stored tokens and redirect to login

## Security Notes

- Tokens are stored in localStorage
- Refresh tokens automatically redirect to login on failure
- All API requests include authorization headers automatically
- Expired tokens are cleaned up automatically

## Files Modified/Added

- `src/utils/auth.js` - Added refresh functionality and token validation
- `src/utils/apiClient.js` - New axios instance with interceptors
- `src/context/AuthContext.jsx` - Added refresh methods and auto-refresh
- `src/components/ProtectedRoute.jsx` - Added token expiration checks
- `src/components/TokenRefreshButton.jsx` - Manual refresh button component
- `src/hooks/useAutoTokenRefresh.js` - Auto refresh hook
- `src/hooks/useTokenRefresh.js` - Token refresh utility hook
- `src/pages/Login.jsx` - Updated to use new API client
