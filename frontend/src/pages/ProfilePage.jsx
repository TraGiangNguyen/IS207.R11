import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import authService from "../services/authService.js";
import { User, KeyRound, CheckCircle2, AlertCircle, Camera, Lock, Mail, UserCheck } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  // Form states
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI status states
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [originalAvatarUrl, setOriginalAvatarUrl] = useState("");
  const [showPasswordExit, setShowPasswordExit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load current user data into form
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setAvatarUrl(user.avatarUrl || "");
      setOriginalAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleAvatarToggle = () => {
    if (showAvatarInput) {
      setAvatarUrl(originalAvatarUrl);
      setShowAvatarInput(false);
      return;
    }

    setOriginalAvatarUrl(avatarUrl);
    setShowAvatarInput(true);
  };

  const handlePasswordExit = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordExit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validate if user wants to change password
    const isChangingPassword = oldPassword || newPassword || confirmPassword;

    if (isChangingPassword) {
      if (!oldPassword) {
        setMessage({ type: "error", text: "Please enter your current password to confirm changes." });
        return;
      }
      if (!newPassword) {
        setMessage({ type: "error", text: "Please enter a new password." });
        return;
      }
      if (newPassword.length < 6) {
        setMessage({ type: "error", text: "New password must be at least 6 characters long." });
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "New password and confirmation do not match." });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Update Profile Info if changed
      let profileUpdated = false;
      if (fullName !== (user?.fullName || "") || avatarUrl !== (user?.avatarUrl || "")) {
        await updateProfile({ fullName, avatarUrl });
        profileUpdated = true;
      }

      // 2. Change password if password fields provided
      let passwordUpdated = false;
      if (isChangingPassword) {
        await authService.changePassword({
          currentPassword: oldPassword,
          newPassword,
          confirmPassword,
        });
        passwordUpdated = true;
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      if (profileUpdated && passwordUpdated) {
        setMessage({ type: "success", text: "Profile details and password updated successfully!" });
      } else if (profileUpdated) {
        setMessage({ type: "success", text: "Profile details updated successfully!" });
      } else if (passwordUpdated) {
        setMessage({ type: "success", text: "Password changed successfully!" });
      } else {
        setMessage({ type: "info", text: "No information was changed." });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "An error occurred. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract initial character for fallback avatar
  const initialChar = (fullName || user?.username || "U").charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner Header */}
        <div className="h-32 bg-gradient-to-r from-[#008B8B] to-[#00A896] relative"></div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-0 relative">
          {/* Notification Alert */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : message.type === "error"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* User Profile Header Section: Avatar (Framed Circle) & Info on the Right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 -mt-16 mb-8">
            {/* Avatar framed in a circle */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full ring-4 ring-white shadow-md bg-[#caf8e4] text-[#008B8B] flex items-center justify-center font-bold text-3xl overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName || "User Avatar"}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarUrl("")}
                  />
                ) : (
                  <span>{initialChar}</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleAvatarToggle}
                className="absolute bottom-1 right-1 p-2 bg-[#008B8B] text-white rounded-full shadow-lg hover:bg-[#007373] transition-colors"
                title="Change Avatar URL"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Info placed to the right of Avatar: Full Name & Email (small below) */}
            <div className="flex-1 w-full pt-2 sm:pt-12">
              <div className="space-y-3">
                {/* Full Name field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008B8B] focus:border-transparent transition-all text-gray-900 font-semibold text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Email address field (written small below Full Name) */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-0.5">
                    Email Address (Read-only)
                  </label>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-normal text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 inline-block">
                      {user?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* URL Avatar Toggle Input */}
              {showAvatarInput && (
                <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="block text-xs font-medium text-[#008B8B]">
                      New Avatar Image URL:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl(originalAvatarUrl);
                        setShowAvatarInput(false);
                      }}
                      className="px-2.5 py-1 text-[10px] font-semibold text-[#008B8B] bg-white border border-[#008B8B] rounded-md hover:bg-[#008B8B] hover:text-white transition-colors"
                    >
                      Exit
                    </button>
                  </div>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
                  />
                </div>
              )}
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          {/* Change Password (Displayed below the fields above) */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#008B8B]" />
                Change Password
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                To change your password, please enter your current password to confirm changes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Field 1: Old Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Current Password (Confirm Changes)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={oldPassword}
                    onFocus={() => setShowPasswordExit(true)}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008B8B] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {/* Field 2: New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onFocus={() => setShowPasswordExit(true)}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008B8B] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {/* Field 3: Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onFocus={() => setShowPasswordExit(true)}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008B8B] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
            {showPasswordExit && (
              <button
                type="button"
                onClick={handlePasswordExit}
                className="px-4 py-3 border border-[#008B8B] text-[#008B8B] bg-white hover:bg-[#008B8B] hover:text-white font-semibold rounded-xl shadow-sm transition-all text-sm"
              >
                Exit
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-[#008B8B] hover:bg-[#007373] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Confirm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
