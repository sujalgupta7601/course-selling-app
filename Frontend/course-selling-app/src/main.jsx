import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js';
import {
  Elements
} from '@stripe/react-stripe-js';
const stripePromise = loadStripe(
  "pk_test_51TO0TMRMK3BSvZglWtQ6k6wQfunvgqu3KE1H0Z8Mwdi1E086g5dOzIdFs2D9kUHVFUwJYiadu2oOhWWP39KhxZpw00KaEK0zGM",
);
createRoot(document.getElementById("root")).render(
  
    <Elements
      stripe={stripePromise}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Elements>
);
