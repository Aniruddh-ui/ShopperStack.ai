import os
import requests
from typing import List, Dict, Optional


class SerpService:
    def __init__(self):
        self.api_key: Optional[str] = os.getenv("SERPAPI_KEY")
        self.base_url: str = "https://serpapi.com/search"

    def search_products(self, query: str) -> List[Dict]:
        """
        Fetch shopping results using SerpApi (google_shopping engine).

        Returns a list of product dicts with keys:
        - title (str)
        - price (str)
        - link (str)
        - source (str)
        - snippet (str)

        If API key is missing or request fails, returns an empty list.
        """
        if not self.api_key:
            print("⚠️ SERPAPI_KEY not set in environment.")
            return []

        params = {
            "q": query,
            "engine": "google_shopping",
            "api_key": self.api_key
        }

        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            print(f"⚠️ SERPAPI request failed: {e}")
            return []

        results = []
        for item in data.get("shopping_results", []):
            product = {
                "title": item.get("title", "").strip(),
                "price": item.get("price", "").strip(),
                "link": item.get("link", ""),
                "source": item.get("source", ""),
                "snippet": item.get("snippet") or item.get("description", "")
            }
            # Only include items that at least have a title and link
            if product["title"] and product["link"]:
                results.append(product)

        return results
