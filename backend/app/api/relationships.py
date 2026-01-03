from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.relationships import RelationshipList, Relationship
from app.services.relationship_service import RelationshipService
from uuid import UUID

router = APIRouter()


@router.get("", response_model=RelationshipList)
async def get_relationships(
    category: Optional[str] = Query(None, description="Filter by category")
):
    """
    Get all relationship types for dropdown selection.
    Returns 20+ relationships organized by category.
    """
    service = RelationshipService()
    
    if category:
        relationships = await service.get_by_category(category)
    else:
        relationships = await service.get_all()
    
    return {
        "relationships": relationships,
        "total": len(relationships)
    }


@router.get("/categories")
async def get_relationship_categories():
    """Get unique relationship categories"""
    service = RelationshipService()
    relationships = await service.get_all()
    
    categories = list(set(r.get("category") for r in relationships if r.get("category")))
    categories.sort()
    
    return {"categories": categories}


@router.get("/{relationship_id}", response_model=Relationship)
async def get_relationship(relationship_id: UUID):
    """Get a specific relationship by ID"""
    service = RelationshipService()
    return await service.get_by_id(relationship_id)
