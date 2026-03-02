from __future__ import annotations

from typing import Any, Awaitable, Callable

ToolHandler = Callable[[dict[str, Any]], Awaitable[dict[str, Any]]]


class ToolRouter:
    def __init__(self) -> None:
        self._handlers: dict[str, ToolHandler] = {}

    def register(self, name: str, handler: ToolHandler) -> None:
        self._handlers[name] = handler

    async def run(self, tool: str, payload: dict[str, Any]) -> dict[str, Any]:
        if tool not in self._handlers:
            return {'ok': False, 'error': f'unknown tool: {tool}'}
        return await self._handlers[tool](payload)
