"use client";
import { useState, useEffect } from "react";
import { registerSchema } from "@/utils/registerValidation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HashLoader } from "react-spinners";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState([]);

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  if (!api_url) {
    throw new Error("API_URL is not defined in .env");
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: res } = await axios.get(`${api_url}/user/register`);
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
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldErrors: any = {};
      validation.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = axios.post(`${api_url}/auth/register`, {
        email: formData.email,
        password: formData.password,
      });

      if ((await res).status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
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

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                data-aos="flip-up"
              >
                Register
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
