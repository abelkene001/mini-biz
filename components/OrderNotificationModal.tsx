"use client";

import { useState } from "react";

interface OrderNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminWhatsapp?: string;
  customerName: string;
  productName: string;
  amount: number;
}

export default function OrderNotificationModal({
  isOpen,
  onClose,
  adminWhatsapp,
  customerName,
  productName,
  amount,
}: OrderNotificationModalProps) {
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  // Convert phone number to WhatsApp format
  const formatWhatsappNumber = (phone: string) => {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, "");
    // If it starts with 234 (Nigeria), keep it; otherwise assume Nigeria and add 234
    if (digitsOnly.startsWith("234")) {
      return digitsOnly;
    }
    // If it starts with 0, replace with 234
    if (digitsOnly.startsWith("0")) {
      return "234" + digitsOnly.substring(1);
    }
    // Otherwise, add 234 prefix
    return "234" + digitsOnly;
  };

  const handleNotifyAdmin = async () => {
    if (!adminWhatsapp) return;

    setSending(true);

    try {
      const formattedPhone = formatWhatsappNumber(adminWhatsapp);

      // Create a professional message
      const message = `🎉 *New Order Received!*

👤 Customer: ${customerName}
📦 Product: ${productName}
💰 Amount: ₦${amount.toLocaleString()}

Please confirm order receipt and details in your dashboard.`;

      // Open WhatsApp Web with pre-filled message
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, "_blank", "width=500,height=700");
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-3xl p-8 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-white">Notify Admin</h2>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600 text-center">
              Would you like to notify the shop admin about your order via
              WhatsApp?
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Order Details:</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Product: <span className="font-medium">{productName}</span>
              </p>
              <p className="text-sm text-gray-600">
                Amount:{" "}
                <span className="font-bold text-green-600">
                  ₦{amount.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleNotifyAdmin}
              disabled={sending || !adminWhatsapp}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
            >
              {sending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Opening WhatsApp...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.968 1.495c-1.529.902-2.775 2.24-3.614 3.81-.839 1.57-1.245 3.37-1.143 5.171.101 1.802.645 3.532 1.577 5.04.932 1.509 2.275 2.738 3.897 3.536 1.622.799 3.46 1.08 5.23.804 1.77-.276 3.388-1.077 4.602-2.269 1.214-1.192 2.036-2.783 2.367-4.472.331-1.69.065-3.466-.768-5.015-.833-1.549-2.177-2.809-3.747-3.584-1.57-.775-3.383-1.047-5.161-.785zM12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                  </svg>
                  Notify via WhatsApp
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 font-bold transition-all"
            >
              Skip for Now
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-gray-500 text-center">
            💡 This will open WhatsApp on your device with a pre-written message
            to the shop admin.
          </p>
        </div>
      </div>
    </div>
  );
}
