from typing import List, Dict
from services.serp import SerpService

class SerpAgent:
    def __init__(self):
        self.serp_service = SerpService()

    def find_similar_products(self, query: str) -> List[Dict]:
        """Return a list of product dicts from SerpService with keys: title, link, price, source, snippet."""
        return self.serp_service.search_products(query)

    # Backwards-compatible alias if other code expects `run`
    def run(self, query: str) -> List[Dict]:
        return self.find_similar_products(query)
