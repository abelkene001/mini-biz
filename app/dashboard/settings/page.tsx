"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface ShopData {
  id: string;
  name: string;
  whatsapp_number: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    whatsapp_number: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
  });

  // Fetch shop data
  useEffect(() => {
    if (user?.id) {
      fetchShopData();
    }
  }, [user?.id]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setShop(data);
        setFormData({
          name: data.name || "",
          whatsapp_number: data.whatsapp_number || "",
          bank_name: data.bank_name || "",
          bank_account_number: data.bank_account_number || "",
          bank_account_name: data.bank_account_name || "",
        });
      }
    } catch (err) {
      console.error("Error fetching shop data:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Business name is required";
    }

    if (formData.whatsapp_number.trim()) {
      // Telegram Chat ID should be numeric (optional field)
      if (!/^\d+$/.test(formData.whatsapp_number.trim())) {
        newErrors.whatsapp_number = "Telegram Chat ID must be numeric";
      }
    }

    if (formData.bank_account_number.trim() && !formData.bank_name.trim()) {
      newErrors.bank_name =
        "Bank name is required if account number is provided";
    }

    if (formData.bank_name.trim() && !formData.bank_account_number.trim()) {
      newErrors.bank_account_number =
        "Account number is required if bank name is provided";
    }

    if (formData.bank_account_number.trim()) {
      // Validate account number is numeric
      if (!/^\d+$/.test(formData.bank_account_number.trim())) {
        newErrors.bank_account_number =
          "Account number must contain only digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!shop?.id) {
      setErrors({ general: "Shop data not found" });
      return;
    }

    try {
      setSaving(true);
      setSuccessMessage("");

      const { error } = await supabase
        .from("shops")
        .update({
          name: formData.name,
          whatsapp_number: formData.whatsapp_number,
          bank_name: formData.bank_name,
          bank_account_number: formData.bank_account_number,
          bank_account_name: formData.bank_account_name,
        })
        .eq("id", shop.id);

      if (error) throw error;

      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setErrors({ general: "Failed to save settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="inline-block p-4 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-6 sm:py-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your shop information and business details
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3 animate-slideUp">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-900">Success</h3>
              <p className="mt-1 text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-slideUp">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-red-900">Error</h3>
              <p className="mt-1 text-sm text-red-800">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information Section */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🏪</span>
                Business Information
              </h2>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                    errors.name
                      ? "border-red-500 bg-red-50 text-gray-900 placeholder-red-400"
                      : "border-gray-200 bg-gray-50 hover:border-sky-200 focus:border-sky-500 focus:bg-white text-gray-900"
                  } focus:outline-none`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.101 12.93a1 1 0 00-1.01-1.986c-.04.002-.08.004-.12.004a1 1 0 00-.897.555 7 7 0 11.979-1.479 1 1 0 001.414 1.414 9 9 0 10-1.366 2.492zM10 7a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">💬</span>
                Notification Preferences
              </h2>
            </div>

            <div className="px-6 py-6">
              <div>
                <label
                  htmlFor="whatsapp_number"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Telegram Chat ID
                </label>
                <input
                    type="text"
                    id="whatsapp_number"
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    placeholder="Enter your Telegram Chat ID"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                      errors.whatsapp_number
                        ? "border-red-500 bg-red-50 text-gray-900 placeholder-red-400"
                        : "border-gray-200 bg-gray-50 hover:border-emerald-200 focus:border-emerald-500 focus:bg-white text-gray-900"
                    } focus:outline-none`}
                  />
                {errors.whatsapp_number && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.101 12.93a1 1 0 00-1.01-1.986c-.04.002-.08.004-.12.004a1 1 0 00-.897.555 7 7 0 11.979-1.479 1 1 0 001.414 1.414 9 9 0 10-1.366 2.492zM10 7a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.whatsapp_number}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  <strong>How to get your Telegram Chat ID:</strong>
                  <ol className="mt-2 ml-4 space-y-1 list-decimal">
                    <li>Search for <code className="bg-gray-100 px-1 py-0.5 rounded">@BotFather</code> on Telegram</li>
                    <li>Create a new bot and get your Bot Token</li>
                    <li>Start a chat with your bot</li>
                    <li>Visit: <code className="bg-gray-100 px-1 py-0.5 rounded">https://api.telegram.org/bot{`<YOUR_BOT_TOKEN>`}/getUpdates</code></li>
                    <li>Copy your Chat ID from the response</li>
                  </ol>
                </p>
              </div>
            </div>
          </div>

          {/* Bank Information Section */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🏦</span>
                Bank Information
              </h2>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Bank Name */}
              <div>
                <label
                  htmlFor="bank_name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  placeholder="e.g., GTBank, Access Bank, First Bank"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                    errors.bank_name
                      ? "border-red-500 bg-red-50 text-gray-900 placeholder-red-400"
                      : "border-gray-200 bg-gray-50 hover:border-amber-200 focus:border-amber-500 focus:bg-white text-gray-900"
                  } focus:outline-none`}
                />
                {errors.bank_name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.101 12.93a1 1 0 00-1.01-1.986c-.04.002-.08.004-.12.004a1 1 0 00-.897.555 7 7 0 11.979-1.479 1 1 0 001.414 1.414 9 9 0 10-1.366 2.492zM10 7a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.bank_name}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label
                  htmlFor="bank_account_number"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="bank_account_number"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  placeholder="Enter your bank account number"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                    errors.bank_account_number
                      ? "border-red-500 bg-red-50 text-gray-900 placeholder-red-400"
                      : "border-gray-200 bg-gray-50 hover:border-amber-200 focus:border-amber-500 focus:bg-white text-gray-900"
                  } focus:outline-none`}
                />
                {errors.bank_account_number && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.101 12.93a1 1 0 00-1.01-1.986c-.04.002-.08.004-.12.004a1 1 0 00-.897.555 7 7 0 11.979-1.479 1 1 0 001.414 1.414 9 9 0 10-1.366 2.492zM10 7a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.bank_account_number}
                  </p>
                )}
              </div>

              {/* Account Name */}
              <div>
                <label
                  htmlFor="bank_account_name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Account Holder Name
                </label>
                <input
                  type="text"
                  id="bank_account_name"
                  name="bank_account_name"
                  value={formData.bank_account_name}
                  onChange={handleChange}
                  placeholder="Name on the bank account"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors duration-200 font-medium ${
                    errors.bank_account_name
                      ? "border-red-500 bg-red-50 text-gray-900 placeholder-red-400"
                      : "border-gray-200 bg-gray-50 hover:border-amber-200 focus:border-amber-500 focus:bg-white text-gray-900"
                  } focus:outline-none`}
                />
                {errors.bank_account_name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.101 12.93a1 1 0 00-1.01-1.986c-.04.002-.08.004-.12.004a1 1 0 00-.897.555 7 7 0 11.979-1.479 1 1 0 001.414 1.414 9 9 0 10-1.366 2.492zM10 7a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.bank_account_name}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  This should match the name on your bank account
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed shadow-md"
            >
              {saving ? (
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
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: shop?.name || "",
                  whatsapp_number: shop?.whatsapp_number || "",
                  bank_name: shop?.bank_name || "",
                  bank_account_number: shop?.bank_account_number || "",
                  bank_account_name: shop?.bank_account_name || "",
                });
                setErrors({});
              }}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 transition-all duration-200 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancel
            </button>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">💡 Tip:</p>
              <p>
                Keep your business information updated to ensure customers can
                reach you and payments process correctly.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
