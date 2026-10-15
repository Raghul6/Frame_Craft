// Global styles first so page stylesheets (loaded with the routes) can build on them.
import "./App.css";
import "./styles/forms.css";
import "./styles/animations.css";
import "./styles/toast.css";
import "./styles/dialog.css";
import "./styles/loading.css";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import ScrollToTop from "./components/common/ScrollToTop";
import Toaster from "./components/common/Toaster";
import { bootstrapAuth } from "./features/auth/thunks";
import { useAuth } from "./hooks/useAuth";
import { preloadAdmin } from "./routes/routes";
import AppRoutes from "./routes/AppRoutes";
import { whenIdle } from "./utils/lazyWithPreload";

const App = () => {
  const dispatch = useAppDispatch();

  // Silently restore a saved session; never forces a login on first visit.
  useEffect(() => {
    void dispatch(bootstrapAuth());
  }, [dispatch]);

  // Admins will almost certainly open the panel — fetch it while the browser is idle.
  const { isAdmin } = useAuth();
  useEffect(() => {
    if (isAdmin) whenIdle(preloadAdmin);
  }, [isAdmin]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
