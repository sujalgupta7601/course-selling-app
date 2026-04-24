import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { BACKEND_URL } from "../../utils/utils";
const Buy = () => {
  const courseId = useParams().courseId;
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchBuyCourseData = async () => {
      if (!token) {
        setError("Kindly login to buy the course");
        return;
      }
      try {
        const response = await axios.post(
          `${BACKEND_URL}api/v1/course/buy/${courseId}`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        console.log("buy course response", response.data);
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
        setloading(false);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Something went wrong");
        setloading(false);
        navigate("/purchases");
      }
    };
    fetchBuyCourseData();
  }, [courseId]);
  const handlePurchase = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or elements not found.");
      return;
    }
    setloading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Card element not found.");
      setloading(false);
      return;
    }

    if (!clientSecret) {
      console.log("Client secret not found.");
      setloading(false);
      return;
    }

    const { paymentIntent, error: ConfirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });
    if (ConfirmError) {
      console.log("stripe error", ConfirmError);
      setloading(false);
      setCardError(ConfirmError.message);
      return;
    } else if (paymentIntent.status === "succeeded") {
      console.log("payment successful", paymentIntent);
      setCardError("your payment id: " + paymentIntent.id);
      const paymentInfo = {
        email: user?.user?.email,
        userId:user?.user?.id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
      };
      console.log("payment info", paymentInfo);
      
      // Send purchase confirmation to backend
      try {
        const response = await axios.post(
          "http://localhost:4001/api/v1/course/confirm-purchase",
          {
            courseId: paymentInfo.courseId,
            paymentId: paymentInfo.paymentId,
            amount: paymentInfo.amount,
            status: paymentInfo.status,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Purchase confirmed:", response.data);
      } catch (error) {
        console.error("Error confirming purchase:", error);
        toast.error(error?.response?.data?.error || "Error saving purchase");
        setloading(false);
        return;
      }
      await axios.post(
        `${BACKEND_URL}/order`,
        paymentInfo,{
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((res) => {
        console.log("Order created:", res.data);
      }).catch((err) => {
        console.error("Error creating order:", err);
        toast.error(err?.response?.data?.error || "Error creating order");
      });
      toast.success("Payment successful! Course added to your purchases.");
      navigate("/purchases");
    }
    setloading(false);
  };

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Buy;
