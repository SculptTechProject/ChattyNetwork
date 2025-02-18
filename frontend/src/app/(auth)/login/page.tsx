"use client";
import { useState, useEffect, useRef } from "react";
import { loginSchema } from "@/utils/loginValidation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { HashLoader } from "react-spinners";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  if (!api_url) {
    throw new Error("API_URL is not defined in .env");
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: res } = await axios.get(`${api_url}/user/count`);
        setData(res);
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
    const validation = loginSchema.safeParse(formData);

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
      }

      return;
    }

    try {
      const res = axios.post(`${api_url}/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      if ((await res).status === 201) {
        document.cookie = `token=${(await res).data.token}; path=/`;
        router.push("/dashboard");
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
          <Link
            href="/"
            className="pt-2 text-2xl font-bold text-blue-600"
            data-aos="fade-down"
          >
            ChattyNetwork
          </Link>
          <main className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-2xl font-bold mb-4 text-gray-600" data-aos="fade-down">
              Login
            </h1>
            <form onSubmit={handleSubmit} className="w-80 space-y-4">
              <input
                type="email"
                placeholder="Email"
                required
                ref={emailRef}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border p-2 w-full rounded hover:px-6 hover:py-4 transition-all hover:rounded-xl hover:bg-blue-50 hover:border-none"
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
                className="border p-2 w-full rounded hover:px-6 hover:py-4 transition-all hover:rounded-xl hover:bg-blue-50 hover:border-none"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:px-6 hover:py-4 hover:font-bold transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </form>
            <p className="pt-4">
              Need an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline hover:text-blue-400 hover:text-xl transition-all"
              >
                Register
              </Link>
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:underline hover:text-blue-400 hover:text-xl transition-all"
            >
              Back to Home
            </Link>
          </main>
        </div>
      )}
      <footer className="w-full text-gray-300 text-center py-3 mt-auto">
        <p>Chatty Network &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
