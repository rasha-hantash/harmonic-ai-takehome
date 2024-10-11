import uuid
from typing import List

from fastapi import APIRouter, Depends, Query, Body
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy.dialects.postgresql import insert

from backend.db import database
from backend.routes.companies import (
    CompanyBatchOutput,
    fetch_companies_with_liked,
)

router = APIRouter(
    prefix="/collections",
    tags=["collections"],
)

class UpdateLikedRequest(BaseModel):
    companyIds: List[int]


class CompanyCollectionMetadata(BaseModel):
    id: uuid.UUID
    collection_name: str


class CompanyCollectionOutput(CompanyBatchOutput, CompanyCollectionMetadata):
    pass


LIKED_COLLECTION_ID = None

@router.get("", response_model=list[CompanyCollectionMetadata])
def get_all_collection_metadata(
    db: Session = Depends(database.get_db),
):
    collections = db.query(database.CompanyCollection).all()

    return [
        CompanyCollectionMetadata(
            id=collection.id,
            collection_name=collection.collection_name,
        )
        for collection in collections
    ]


@router.get("/{collection_id}", response_model=CompanyCollectionOutput)
def get_company_collection_by_id(
    collection_id: uuid.UUID,
    offset: int = Query(
        0, description="The number of items to skip from the beginning"
    ),
    limit: int = Query(10, description="The number of items to fetch"),
    db: Session = Depends(database.get_db),
):
    query = (
        db.query(database.CompanyCollectionAssociation, database.Company)
        .join(database.Company)
        .filter(database.CompanyCollectionAssociation.collection_id == collection_id)
    )

    total_count = query.with_entities(func.count()).scalar()

    results = query.offset(offset).limit(limit).all()
    companies = fetch_companies_with_liked(db, [company.id for _, company in results])

    return CompanyCollectionOutput(
        id=collection_id,
        collection_name=db.query(database.CompanyCollection)
        .get(collection_id)
        .collection_name,
        companies=companies,
        total=total_count,
    )


# todo see what is in liked collection 
# Usage in a route // todo put or post? (also look up patch)
@router.put("/updateLiked")
def update_liked_collection_route(
    request: UpdateLikedRequest = Body(...),
    db: Session = Depends(database.get_db)
):
    print("Received request to update liked collection")
    print(f"Company IDs: {request.companyIds}")
    
    # Call the update_liked_collection function
    update_liked_collection(db, request.companyIds)
    
    return {"message": "Liked collection updated successfully"}

def update_liked_collection(db: Session, company_ids: list[int]):
    global LIKED_COLLECTION_ID
    if LIKED_COLLECTION_ID is None:
        stmt = db.query(database.CompanyCollection.id).filter(database.CompanyCollection.collection_name == 'Liked Companies').first()
        if stmt is None:
            raise ValueError("'Liked Companies' collection not found")
        LIKED_COLLECTION_ID = stmt[0]

    successful_ids = []
    failed_ids = []

    for company_id in company_ids:
        try:
            stmt = insert(database.CompanyCollectionAssociation).values(
                company_id=company_id, 
                collection_id=LIKED_COLLECTION_ID
            ).on_conflict_do_nothing(
                index_elements=["company_id", "collection_id"]
            )
            db.execute(stmt)
            db.commit()
            successful_ids.append(company_id)
        except IntegrityError as e:
            db.rollback()
            failed_ids.append(company_id)
        except Exception as e:
            db.rollback()
            failed_ids.append(company_id)
            print(f"Unexpected error occurred for company_id {company_id}: {str(e)}")

    return {
        "successful": successful_ids,
        "failed": failed_ids
    }

# todo make sure that on conflict do nothing to prevent throttle 
