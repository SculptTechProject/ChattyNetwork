"use client";
import { useState, useEffect, useRef } from "react";
import { registerSchema } from "@/utils/registerValidation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HashLoader } from "react-spinners";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  if (!api_url) {
    throw new Error("API_URL is not defined in .env");
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: res } = await axios.get(`${api_url}/user/count`);
        setUserCount(res.count);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [api_url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldErrors: any = {};
      validation.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);

      if (fieldErrors.email) {
        emailRef.current?.focus();
      } else if (fieldErrors.password) {
        passwordRef.current?.focus();
      } else if (fieldErrors.confirmPassword) {
        confirmPasswordRef.current?.focus();
      }

      return;
    }

    try {
      const res = axios.post(`${api_url}/user/register`, {
        email: formData.email,
        password: formData.password,
      });

      if ((await res).status === 201) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center border-sky-600 transition-all">
      {loading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-2xl font-bold text-blue-600 pb-3">
            ChattyNetwork
          </div>
          <HashLoader color="#2563EB" />
        </div>
      )}
      {!loading && (
        <div className="min-h-screen flex flex-col justify-between items-center border-sky-600 transition-all">
          <Link href="/" className="pt-2 text-2xl font-bold text-blue-600" data-aos="fade-down">
            ChattyNetwork
          </Link>
          <h1 className="text-xl font-semibold text-gray-600" data-aos="flip-up">
            Count of registered users: {userCount}
          </h1>
          <main className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-2xl font-bold mb-4" data-aos="fade-down">
              Register
            </h1>
            <form onSubmit={handleSubmit} className="w-80 space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                required
                ref={emailRef}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border p-2 w-full rounded"
                data-aos="fade-left"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}

              <input
                type="password"
                placeholder="Password"
                required
                ref={passwordRef}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border p-2 w-full rounded"
                data-aos="fade-right"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}

              <input
                type="password"
                placeholder="Confirm Password"
                required
                ref={confirmPasswordRef}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                data-aos="flip-up"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </form>
            <p className="pt-4">
              Have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline"
                data-aos="flip-down"
              >
                Login
              </Link>
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:underline"
              data-aos="fade-up"
            >
              Back to Home
            </Link>
          </main>
        </div>
      )}

      <footer
        className="w-full text-gray-300 text-center py-3 mt-auto"
        data-aos="fade-up"
      >
        <p>Chatty Network &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
