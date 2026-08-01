"use client";
import { useAuth } from "@/context/AuthContext";

export default function LoginWithPi() {
  const { user, piReady, pilogin, logout, loading } = useAuth();

  if (loading) {
    return <p className="text-[var(--text-muted)] text-center mt-4">⏳ Đang kiểm tra phiên...</p>;
  }

  if (!piReady) {
    return (
      <div className="text-center text-[var(--text-muted)] mt-4">
        ⏳ Đang tải Pi SDK...<br /> (Vui lòng mở trong Pi Browser)
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center mt-4">
        <p className="text-green-600 mb-2">👤 Xin chào, {user.username}</p>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={pilogin}
        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
      >
        Đăng nhập với Pi
      </button>
    </div>
  );
}
