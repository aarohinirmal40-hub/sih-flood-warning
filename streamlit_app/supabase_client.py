"""Supabase client for community flood reports."""
import os
from dataclasses import dataclass

try:
    from supabase import create_client, Client
except ImportError:
    Client = None  # type: ignore

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY", "")

_supabase: Client | None = None


def _get_client() -> Client | None:
    global _supabase
    if _supabase is not None:
        return _supabase
    if Client is None or not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return None
    try:
        _supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        return _supabase
    except Exception:
        return None


@dataclass
class FloodReport:
    id: str
    name: str
    location: str
    issue: str
    details: str
    created_at: str


def fetch_reports() -> list[FloodReport]:
    client = _get_client()
    if client is None:
        return []
    try:
        resp = client.table("flood_reports").select("*").order("created_at", desc=True).execute()
        data = resp.data or []
        return [
            FloodReport(
                id=r.get("id", ""),
                name=r.get("name", ""),
                location=r.get("location", ""),
                issue=r.get("issue", ""),
                details=r.get("details", ""),
                created_at=r.get("created_at", ""),
            )
            for r in data
        ]
    except Exception:
        return []


def insert_report(name: str, location: str, issue: str, details: str) -> bool:
    client = _get_client()
    if client is None:
        return False
    try:
        client.table("flood_reports").insert({
            "name": name,
            "location": location,
            "issue": issue,
            "details": details,
        }).execute()
        return True
    except Exception:
        return False
