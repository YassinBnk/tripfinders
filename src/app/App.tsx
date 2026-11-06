import { RouterProvider } from "react-router";
import { ToastProvider } from "@/components/ui/overlays";
import { router } from "./router";
import { StoreProvider } from "./store";

export function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </StoreProvider>
  );
}
