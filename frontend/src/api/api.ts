import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: number;
}

export function getReceiverId(): number | null {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const params = useParams();
  const receiverId = params.receiverId;
  return receiverId ? Number(receiverId) : null;
}

export function getUserId(): number | null {
  const token = getCookie("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.userId;
  } catch (error) {
    console.error("Błąd dekodowania tokena:", error);
    return null;
  }
}

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};
