import { SearchResult } from "@/types/search/search-type";
import Cookies from "js-cookie";

export async function fetchSearchResult(
  startDate?: string | null,
  endDate?: string | null,
  keyword?: string
): Promise<SearchResult | null> {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append("keyword", keyword);
    if (startDate && startDate.trim() !== "")
      queryParams.append("startDate", startDate);
    if (endDate && endDate.trim() !== "")
      queryParams.append("endDate", endDate);

    const queryURL = `${baseURL}/search?${queryParams.toString()}`;

    const response = await fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const { result }: { result: SearchResult } = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch project summary list:", error);
    return null;
  }
}
