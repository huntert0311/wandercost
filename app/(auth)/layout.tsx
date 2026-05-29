export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Wander<span style={{ color: "#1D9E75" }}>cost</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
