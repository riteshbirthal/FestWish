"""
FestWish Database Seeder
========================
Run this script to populate the database with:
- Festivals (12+)
- Quotes (10+ per festival)
- Messages (10+ templates x 12 festivals x 29 relationships = 3,480+ messages)

Usage:
    python -m seeds.run_seed

Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in environment.
"""

import os
import sys
from uuid import uuid4

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

from seeds.seed_festivals import FESTIVALS
from seeds.seed_quotes import FESTIVAL_QUOTES
from seeds.seed_messages import RELATIONSHIP_MESSAGE_TEMPLATES, FESTIVAL_GREETINGS


def get_client():
    """Get Supabase admin client"""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
        sys.exit(1)
    
    return create_client(url, key)


def seed_festivals(client):
    """Seed festivals table"""
    print("\n[1/3] Seeding festivals...")
    
    for festival in FESTIVALS:
        # Check if exists
        existing = client.table("festivals").select("id").eq("slug", festival["slug"]).execute()
        
        if existing.data:
            print(f"  - Festival '{festival['name']}' already exists, skipping...")
            continue
        
        result = client.table("festivals").insert(festival).execute()
        if result.data:
            print(f"  + Added festival: {festival['name']}")
        else:
            print(f"  ! Failed to add festival: {festival['name']}")
    
    print(f"  Festivals seeding complete!")


def seed_quotes(client):
    """Seed festival quotes"""
    print("\n[2/3] Seeding quotes...")
    
    # Get festival IDs
    festivals = client.table("festivals").select("id, slug").execute()
    festival_map = {f["slug"]: f["id"] for f in festivals.data}
    
    total_quotes = 0
    for slug, quotes in FESTIVAL_QUOTES.items():
        festival_id = festival_map.get(slug)
        if not festival_id:
            print(f"  ! Festival not found for slug: {slug}")
            continue
        
        # Check existing quotes
        existing = client.table("festival_quotes").select("id").eq("festival_id", festival_id).execute()
        if existing.data and len(existing.data) >= len(quotes):
            print(f"  - Quotes for '{slug}' already exist, skipping...")
            continue
        
        for quote in quotes:
            quote_data = {
                "festival_id": festival_id,
                "quote_text": quote["quote_text"],
                "author": quote.get("author"),
            }
            client.table("festival_quotes").insert(quote_data).execute()
            total_quotes += 1
        
        print(f"  + Added {len(quotes)} quotes for {slug}")
    
    print(f"  Total quotes added: {total_quotes}")


def seed_messages(client):
    """Seed wish messages for all festival-relationship combinations"""
    print("\n[3/3] Seeding wish messages...")
    
    # Get festivals
    festivals = client.table("festivals").select("id, slug, name").execute()
    festival_map = {f["slug"]: {"id": f["id"], "name": f["name"]} for f in festivals.data}
    
    # Get relationships
    relationships = client.table("relationships").select("id, name").execute()
    relationship_map = {r["name"]: r["id"] for r in relationships.data}
    
    total_messages = 0
    
    for slug, festival_info in festival_map.items():
        festival_id = festival_info["id"]
        festival_name = festival_info["name"]
        greeting = FESTIVAL_GREETINGS.get(slug, f"Happy {festival_name}")
        
        print(f"  Processing {festival_name}...")
        
        for rel_name, templates in RELATIONSHIP_MESSAGE_TEMPLATES.items():
            relationship_id = relationship_map.get(rel_name)
            if not relationship_id:
                continue
            
            # Check existing messages for this combo
            existing = client.table("wish_messages")\
                .select("id")\
                .eq("festival_id", festival_id)\
                .eq("relationship_id", relationship_id)\
                .execute()
            
            if existing.data and len(existing.data) >= len(templates):
                continue
            
            # Generate messages from templates
            for template in templates:
                message_text = template.replace("{festival}", festival_name).replace("{greeting}", greeting)
                
                message_data = {
                    "festival_id": festival_id,
                    "relationship_id": relationship_id,
                    "message_text": message_text,
                    "tone": "warm",
                    "language": "en"
                }
                
                client.table("wish_messages").insert(message_data).execute()
                total_messages += 1
    
    print(f"  Total messages added: {total_messages}")


def generate_additional_messages(client):
    """Generate additional messages to reach 50+ per combo"""
    print("\n[Bonus] Generating additional message variations...")
    
    # Additional message templates with more variety
    additional_templates = {
        "warm": [
            "On this special occasion of {festival}, sending you my warmest wishes and heartfelt greetings.",
            "May the blessings of {festival} fill your life with joy, peace, and prosperity.",
            "Celebrating {festival} with thoughts of you. May happiness always find its way to you.",
            "As we celebrate {festival}, may you be blessed with everything your heart desires.",
            "Wishing you a {festival} filled with love, laughter, and beautiful memories.",
        ],
        "formal": [
            "On the auspicious occasion of {festival}, please accept my sincere good wishes.",
            "I extend my warmest greetings to you and your family on this {festival}.",
            "May this {festival} bring you and your loved ones immense happiness and success.",
            "Sending you respectful greetings and best wishes on this {festival}.",
            "On this {festival}, may you be blessed with health, wealth, and happiness.",
        ],
        "casual": [
            "Hey! {greeting}! Hope you have an awesome celebration!",
            "{greeting}! Have a blast and enjoy every moment!",
            "Time to celebrate! {greeting} to you and yours!",
            "{greeting}! May your celebrations be epic!",
            "It's {festival} time! Let's make some amazing memories!",
        ],
        "spiritual": [
            "May the divine blessings of {festival} bring peace and harmony to your life.",
            "On this sacred {festival}, may you find spiritual fulfillment and inner peace.",
            "May the light of {festival} guide you towards wisdom and enlightenment.",
            "Praying for your well-being and happiness on this blessed {festival}.",
            "May {festival} fill your soul with divine light and your life with blessings.",
        ],
    }
    
    # Get all festivals and relationships
    festivals = client.table("festivals").select("id, slug, name").execute()
    relationships = client.table("relationships").select("id, name").execute()
    
    total_added = 0
    
    for festival in festivals.data:
        festival_id = festival["id"]
        festival_name = festival["name"]
        greeting = FESTIVAL_GREETINGS.get(festival["slug"], f"Happy {festival_name}")
        
        for relationship in relationships.data:
            relationship_id = relationship["id"]
            
            # Count existing messages
            existing = client.table("wish_messages")\
                .select("id", count="exact")\
                .eq("festival_id", festival_id)\
                .eq("relationship_id", relationship_id)\
                .execute()
            
            current_count = existing.count if existing.count else 0
            
            # Add more if needed to reach 50+
            if current_count < 50:
                needed = 50 - current_count
                
                for tone, templates in additional_templates.items():
                    if needed <= 0:
                        break
                    
                    for template in templates:
                        if needed <= 0:
                            break
                        
                        message_text = template.replace("{festival}", festival_name)\
                            .replace("{greeting}", greeting)
                        
                        message_data = {
                            "festival_id": festival_id,
                            "relationship_id": relationship_id,
                            "message_text": message_text,
                            "tone": tone,
                            "language": "en"
                        }
                        
                        client.table("wish_messages").insert(message_data).execute()
                        total_added += 1
                        needed -= 1
    
    print(f"  Additional messages added: {total_added}")


def main():
    print("=" * 50)
    print("FestWish Database Seeder")
    print("=" * 50)
    
    client = get_client()
    
    # Run seeders
    seed_festivals(client)
    seed_quotes(client)
    seed_messages(client)
    generate_additional_messages(client)
    
    print("\n" + "=" * 50)
    print("Seeding complete!")
    print("=" * 50)
    
    # Print summary
    festivals_count = client.table("festivals").select("id", count="exact").execute()
    quotes_count = client.table("festival_quotes").select("id", count="exact").execute()
    messages_count = client.table("wish_messages").select("id", count="exact").execute()
    
    print(f"\nDatabase Summary:")
    print(f"  - Festivals: {festivals_count.count}")
    print(f"  - Quotes: {quotes_count.count}")
    print(f"  - Wish Messages: {messages_count.count}")


if __name__ == "__main__":
    main()
