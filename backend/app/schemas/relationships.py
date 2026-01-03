from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class RelationshipBase(BaseModel):
    name: str
    display_name: str
    category: Optional[str] = None
    sort_order: int = 0


class Relationship(RelationshipBase):
    id: UUID
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RelationshipList(BaseModel):
    relationships: List[Relationship]
    total: int
