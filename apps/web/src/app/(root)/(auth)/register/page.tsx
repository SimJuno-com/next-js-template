import { AuthForm } from "../_components/auth-form";
import type { AuthSearchParams } from "../utils";

export default function RegisterPage({ searchParams }: { searchParams: AuthSearchParams }) {
  return <AuthForm mode="register" searchParams={searchParams} />;
}
