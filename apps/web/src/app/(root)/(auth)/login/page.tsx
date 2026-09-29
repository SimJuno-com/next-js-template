import { AuthForm } from "../_components/auth-form";
import type { AuthSearchParams } from "../utils";

export default function LoginPage({ searchParams }: { searchParams: AuthSearchParams }) {
  return <AuthForm mode="login" searchParams={searchParams} />;
}
