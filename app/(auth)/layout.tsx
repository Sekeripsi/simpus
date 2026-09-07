import AuthBanner from "../../components/auth/Banner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen grid grid-cols-2 p-4 gap-4">
      <div className="flex items-center justify-center">
        <AuthBanner />
      </div>
      <div className="shrink-0">
        {children}
      </div>
    </main>
  )
}