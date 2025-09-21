from uagents import Agent, Context, Model
from tavily import TavilyClient
import os
from dotenv import load_dotenv

# Load .env so keys defined there become available to os.getenv
load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

if not TAVILY_API_KEY:
    raise RuntimeError("TAVILY_API_KEY not set. Add it to .env or set the environment variable before starting the server.")

tavily = TavilyClient(api_key=TAVILY_API_KEY)

class TavilyRequest(Model):
    query: str

class TavilyResponse(Model):
    response: str

tavily_agent = Agent(
    name="tavily_agent",
    port=8003,
    seed="tavily_agent_secret",
    endpoint=["http://127.0.0.1:8003/submit"],
)

@tavily_agent.on_message(model=TavilyRequest)
async def tavily_search(ctx: Context, sender: str, msg: TavilyRequest):
    ctx.logger.info(f"Received search query: {msg.query}")
    response = tavily.search(query=msg.query)
    await ctx.send(sender, TavilyResponse(response=response))

if __name__ == "__main__":
    tavily_agent.run()