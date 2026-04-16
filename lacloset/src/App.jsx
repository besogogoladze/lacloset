import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import AppContent from "./layouts/AppContent";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppContent />
          <ToastContainer position="bottom-right" autoClose={2000} />
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default App;
