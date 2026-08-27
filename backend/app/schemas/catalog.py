from pydantic import BaseModel


class SelectOptionOut(BaseModel):
    """Generic {label, value} shape for picker options - matches the
    frontend's `SelectOption` type (src/components/ui/SearchableSelect.tsx)."""

    label: str
    value: str
