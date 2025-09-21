import os
from dotenv import load_dotenv

load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

# Try to use installed tavily client if available
try:
    from tavily import TavilyClient
    client = TavilyClient(api_key=TAVILY_API_KEY) if TAVILY_API_KEY else None
except Exception as e:
    print(f"Tavily client import failed: {e}")
    client = None


def search(query: str):
    """Perform a tavily search. Returns a list of result dicts.
    If the TavilyClient is not available, returns a mocked result set.
    """
    print(f"Searching for: {query}")
    
    if client:
        try:
            print(f"Using Tavily API with key: {TAVILY_API_KEY[:8]}...")
            # assume client.search returns a list or dict; adapt if needed
            results = client.search(query=query)
            print(f"Tavily API returned {len(results) if isinstance(results, list) else 'results'}")
            return results
        except Exception as e:
            print(f"Tavily API search failed: {e}")
    
    # Enhanced fallback mocked response based on query
    print("Using mock Tavily results")
    
    # Generate more realistic mock results based on the search query
    query_lower = query.lower()
    
    # Generate specific results based on query content
    if 'shirt' in query_lower:
        if 'black' in query_lower and 'button' in query_lower:
            mock_results = [
                {
                    "title": "Black Button-Up Dress Shirt - Premium Cotton",
                    "link": "https://example.com/black-shirt1",
                    "snippet": "Professional black button-up dress shirt made from 100% premium cotton. Perfect for office wear and formal occasions. Features a classic collar and button-down design.",
                    "price": "$49.99",
                    "store": "FashionStore",
                    "image": "https://example.com/images/black-shirt1.jpg"
                },
                {
                    "title": "Classic Black Dress Shirt - Formal Office Wear",
                    "link": "https://example.com/black-shirt2", 
                    "snippet": "Timeless black dress shirt with a modern fit. Ideal for business meetings and professional settings. Made from breathable cotton blend.",
                    "price": "$39.99",
                    "store": "OfficeFashion",
                    "image": "https://example.com/images/black-shirt2.jpg"
                },
                {
                    "title": "Black Long Sleeve Button Shirt - Premium Quality",
                    "link": "https://example.com/black-shirt3",
                    "snippet": "High-quality black long-sleeve button-up shirt. Features a comfortable fit and premium fabric. Perfect for both casual and formal occasions.",
                    "price": "$54.99",
                    "store": "PremiumFashion",
                    "image": "https://example.com/images/black-shirt3.jpg"
                }
            ]
        elif 'button' in query_lower:
            mock_results = [
                {
                    "title": "Classic Button-Up Dress Shirt - Premium Cotton",
                    "link": "https://example.com/shirt1",
                    "snippet": "Professional button-up dress shirt made from 100% premium cotton. Available in multiple colors and sizes. Perfect for office wear and formal occasions.",
                    "price": "$49.99",
                    "store": "FashionStore",
                    "image": "https://example.com/images/shirt1.jpg"
                },
                {
                    "title": "Casual Oxford Button Shirt - Comfortable Fit",
                    "link": "https://example.com/shirt2", 
                    "snippet": "Relaxed fit oxford button shirt with a modern cut. Breathable fabric perfect for everyday wear. Multiple color options available.",
                    "price": "$34.99",
                    "store": "CasualWear",
                    "image": "https://example.com/images/shirt2.jpg"
                }
            ]
        else:
            mock_results = [
                {
                    "title": "Premium Dress Shirt Collection",
                    "link": "https://example.com/shirts",
                    "snippet": "Discover our collection of premium dress shirts in various styles, colors, and fits. Perfect for any occasion.",
                    "price": "$29.99",
                    "store": "FashionHub",
                    "image": "https://example.com/images/shirts.jpg"
                }
            ]
    elif 'dress' in query_lower:
        mock_results = [
            {
                "title": "Elegant Evening Dress - Formal Occasions",
                "link": "https://example.com/dress1",
                "snippet": "Stunning evening dress perfect for formal events. Features elegant design with premium materials. Available in various sizes.",
                "price": "$89.99",
                "store": "EleganceFashion",
                "image": "https://example.com/images/dress1.jpg"
            }
        ]
    elif 'jeans' in query_lower or 'pants' in query_lower:
        mock_results = [
            {
                "title": "Premium Denim Jeans - Classic Fit",
                "link": "https://example.com/jeans1",
                "snippet": "High-quality denim jeans with classic fit. Durable material that gets better with age. Multiple washes available.",
                "price": "$59.99",
                "store": "DenimWorld",
                "image": "https://example.com/images/jeans1.jpg"
            }
        ]
    elif 'black' in query_lower:
        mock_results = [
            {
                "title": "Black Fashion Collection - Classic Elegance",
                "link": "https://example.com/black-collection",
                "snippet": "Timeless black fashion pieces with elegant design. Perfect for any occasion and easy to style with other pieces.",
                "price": "$44.99",
                "store": "EleganceFashion",
                "image": "https://example.com/images/black-collection.jpg"
            },
            {
                "title": "Black Office Wear - Professional Style",
                "link": "https://example.com/black-office",
                "snippet": "Professional black office wear including shirts, pants, and accessories. Perfect for business settings.",
                "price": "$54.99",
                "store": "OfficeFashion",
                "image": "https://example.com/images/black-office.jpg"
            }
        ]
    elif 'formal' in query_lower or 'office' in query_lower:
        mock_results = [
            {
                "title": "Professional Office Wear Collection",
                "link": "https://example.com/office-wear",
                "snippet": "Complete collection of professional office wear including shirts, pants, and accessories. Perfect for business professionals.",
                "price": "$39.99",
                "store": "OfficeFashion",
                "image": "https://example.com/images/office-wear.jpg"
            }
        ]
    else:
        # Default mock results for clothing items
        mock_results = [
            {
                "title": "Premium Fashion Item - High Quality",
                "link": "https://example.com/item1",
                "snippet": "Discover this stylish fashion item with premium materials and comfortable fit. Available in various sizes and colors.",
                "price": "$39.99",
                "store": "FashionHub",
                "image": "https://example.com/images/item1.jpg"
            },
            {
                "title": "Trendy Clothing Piece - Modern Design",
                "link": "https://example.com/item2",
                "snippet": "Contemporary design with modern style elements. Perfect for everyday wear and special occasions.",
                "price": "$44.99",
                "store": "StyleStore",
                "image": "https://example.com/images/item2.jpg"
            }
        ]
    
    print(f"Generated {len(mock_results)} mock results")
    return mock_results
