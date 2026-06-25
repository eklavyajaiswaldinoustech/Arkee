// src/hooks/useCheckout.js
import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import axios from 'axios';
import cartService from '../api/services/cartService';

// ── Axios instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8100/api',
  withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('token') ||
    useAuthStore.getState().token ||
    useAuthStore.getState().user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const SAVED_ADDRESSES_KEY = 'arkee_saved_addresses';

const useCheckout = () => {
  const { user } = useAuthStore();
  const { cart, clearCart } = useCartStore();

  const [currentStep, setCurrentStep]         = useState(0);
  const [selectedAddress, setSelectedAddress]   = useState(null);
  const [savedAddresses, setSavedAddresses]     = useState([]);
  const [paymentMethod, setPaymentMethod]       = useState(null);
  const [paymentDetails, setPaymentDetails]     = useState({});
  const [orderPlaced, setOrderPlaced]           = useState(false);
  const [orderId, setOrderId]                   = useState(null);
  const [processing, setProcessing]             = useState(false);
  const [cartItems, setCartItems]               = useState([]);
  const [cartLoading, setCartLoading]           = useState(false);
  const [totalValue, setTotalValue]             = useState(0);

  // ── 1. FETCH CART FROM YOUR BACKEND ───────────────────────────────────
  /*
    YOUR API RESPONSE:
    {
      status: true,
      message: "Cart fetched successfully",
      data: [
        {
          cartid: "6a102cf29543d723bbf644c2",
          cartItemId: "6a102cf264255387f44b609e",
          productid: "681b269b10de4aa3d358b36f",
          quantity: 7,
          price_at_addition: 10000,
          name: "Gold Horse",
          images: ["https://...s3...jpeg", "https://...s3...jpeg"],
          type: "silver",
          category: "antic",
          current_price: 10000,
          metal_type: "",
          karat: 0,
          gender: "Unisex",
          ...
        }
      ],
      totalValue: 70000
    }
  */
  useEffect(() => {
    const fetchCart = async () => {
      setCartLoading(true);
      try {
        // 🔴 API CALL 1 — GET /api/cart
        const res = await api.get('/viewCart');

        if (res.data?.status && Array.isArray(res.data?.data)) {
          // Normalize your backend shape into a consistent format
          // so the rest of the checkout code works cleanly
          const normalized = res.data.data.map((item) => ({
            // IDs
            _id        : item.cartItemId,
            cartId     : item.cartid,
            productid  : item.productid,

            // Quantity
            quantity   : item.quantity || 1,

            // Price — use current_price as primary, fallback to price_at_addition
            price      : item.current_price || item.price_at_addition || 0,
            priceAtAdd : item.price_at_addition || 0,

            // Product details (flat — your backend sends them flat, not nested)
            name       : item.name       || 'Product',
            images     : item.images     || [],
            category   : item.category   || '',
            type       : item.type       || '',
            metal_type : item.metal_type || '',
            karat      : item.karat      || 0,
            gender     : item.gender     || '',

            // Keep the raw item too — just in case
            _raw: item,
          }));

          setCartItems(normalized);
          setTotalValue(res.data.totalValue || 0);
        } else {
          // API returned but no data — fallback to Zustand store
          setCartItems(cart || []);
        }
      } catch (err) {
        console.error('❌ Failed to fetch cart:', err?.response?.data || err.message);
        // Fallback to Zustand store if API fails
        setCartItems(cart || []);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [user]); // re-fetch if user changes (login/logout)

  // ── 2. LOAD SAVED ADDRESSES (localStorage for now) ────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_ADDRESSES_KEY);
      if (raw) {
        const addresses = JSON.parse(raw);
        setSavedAddresses(addresses);
        const defaultAddr = addresses.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }
    } catch {
      setSavedAddresses([]);
    }
  }, []);

  // ── 3. USER DATA ───────────────────────────────────────────────────────
  const getUserData = useCallback(
    () => ({
      firstName: user?.firstname || '',
      lastName : user?.lastname  || '',
      name     :
        user?.name     ||
        user?.fullName ||
        `${user?.firstname || ''} ${user?.lastname || ''}`.trim(),
      email  : user?.email  || '',
      phone  : user?.mobile || user?.phone || '',
      address: user?.address || '',
      city   : user?.city    || '',
      state  : user?.state   || '',
      pincode: user?.pincode || '',
      country: user?.country || 'India',
    }),
    [user]
  );

  // ── 4. SAVE ADDRESS ────────────────────────────────────────────────────
  const saveAddress = useCallback(
    (address) => {
      const id = `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const newAddress = { ...address, id };

      const updated = address.isDefault
        ? savedAddresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
        : [...savedAddresses, newAddress];

      setSavedAddresses(updated);
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
      setSelectedAddress(newAddress);
      return newAddress;
    },
    [savedAddresses]
  );

  // ── 5. DELETE ADDRESS ──────────────────────────────────────────────────
  const deleteAddress = useCallback(
    (addressId) => {
      const updated = savedAddresses.filter((a) => a.id !== addressId);
      setSavedAddresses(updated);
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
      if (selectedAddress?.id === addressId) setSelectedAddress(null);
    },
    [savedAddresses, selectedAddress]
  );

  // ── 6. SET DEFAULT ADDRESS ─────────────────────────────────────────────
  const setDefaultAddress = useCallback(
    (addressId) => {
      const updated = savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));
      setSavedAddresses(updated);
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
    },
    [savedAddresses]
  );

  // ── 7. EDIT ADDRESS ────────────────────────────────────────────────────
  const editAddress = useCallback(
    (addressId, updatedData) => {
      const updated = savedAddresses.map((a) =>
        a.id === addressId ? { ...a, ...updatedData } : a
      );
      setSavedAddresses(updated);
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
      if (selectedAddress?.id === addressId) {
        setSelectedAddress((prev) => ({ ...prev, ...updatedData }));
      }
    },
    [savedAddresses, selectedAddress]
  );

  // ── 8. PRICE CALCULATIONS ──────────────────────────────────────────────
  /*
    Using normalized cartItems:
      item.price    = current_price  (live price from DB)
      item.quantity = quantity
  */
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);

  const shippingCharge = subtotal >= 999 ? 0 : 99;
  const tax            = Math.round(subtotal * 0.03); // 3% GST
  const total          = subtotal + shippingCharge + tax;

  // ── 9. STEP NAVIGATION ─────────────────────────────────────────────────
  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goToStep = (step) => setCurrentStep(step);

  // ── 10. PLACE ORDER ────────────────────────────────────────────────────
  const placeOrder = useCallback(async () => {
    setProcessing(true);
    try {
      const codCharge = paymentMethod === 'cod' ? 40 : 0;

      const orderPayload = {
        // Shipping address
        shippingAddress: selectedAddress,

        // Items — use your backend's field names
        items: cartItems.map((item) => ({
          cartItemId : item._id,
          productid  : item.productid,
          name       : item.name,
          quantity   : item.quantity,
          price      : item.price,
          images     : item.images,
        })),

        // Payment
        paymentMethod : paymentMethod,
        paymentDetails: paymentDetails,

        // Pricing breakdown
        subtotal      : subtotal,
        shippingCharge: shippingCharge,
        tax           : tax,
        codCharge     : codCharge,
        total         : total + codCharge,
      };

      // 🔴 API CALL 2 — POST /api/orders  ← THE MAIN ORDER API
      const res = await api.post('/orders', orderPayload);

      /*
        Expected response from your backend:
        {
          status: true,
          message: "Order placed successfully",
          data: {
            orderId: "ARK-2024-001",   ← or _id
            _id: "mongo_object_id",
            status: "pending",
            ...
          }
        }
      */

      if (res.data?.status) {
        const order = res.data?.data || res.data?.order;
        const oid   = order?.orderId || order?._id;

        setOrderId(oid);
        setOrderPlaced(true);

        // Clear cart after successful order
        if (clearCart) clearCart();

        return oid;
      } else {
        throw new Error(res.data?.message || 'Order failed');
      }
    } catch (err) {
      console.error('❌ Failed to place order:', err?.response?.data || err.message);
      throw err; // Checkout.jsx catches this → shows toast.error
    } finally {
      setProcessing(false);
    }
  }, [
    selectedAddress,
    cartItems,
    paymentMethod,
    paymentDetails,
    subtotal,
    shippingCharge,
    tax,
    total,
    clearCart,
  ]);

  return {
    // Step
    currentStep, setCurrentStep, nextStep, prevStep, goToStep,

    // Address
    selectedAddress, setSelectedAddress,
    savedAddresses,
    saveAddress, deleteAddress, setDefaultAddress, editAddress,

    // Payment
    paymentMethod, setPaymentMethod,
    paymentDetails, setPaymentDetails,

    // Order
    orderPlaced, orderId, processing, placeOrder,

    // User
    getUserData,

    // Cart & Pricing
    cartItems,
    cartLoading,
    subtotal,
    shippingCharge,
    tax,
    total,
    totalValue, // raw totalValue from your backend
  };
};

export default useCheckout;