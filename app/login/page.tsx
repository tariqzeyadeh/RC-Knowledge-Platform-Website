import { Suspense } from "react"
import { LoginPage } from "@/pages/auth/login-page"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  )
}
