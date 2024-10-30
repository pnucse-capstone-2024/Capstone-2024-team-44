from queue import Queue
from threading import Thread
import asyncio
from typing import Any, Dict, List
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import LLMResult
from langchain_openai import ChatOpenAI
from app.settings import app_settings

# OpenAI API 스트리밍
class StreamingHandler(BaseCallbackHandler):
    # 비공개

class Rag_Service:
    # 비공개