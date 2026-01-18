"""
Festival Images Seeder
=====================
Uploads festival images from temp/festival_images to Supabase Storage
and creates corresponding database records.

Usage:
    python -m seeds.seed_images

Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in environment.
"""

import os
import sys
from pathlib import Path
from PIL import Image

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client


# Mapping of image filenames (without extension) to festival slugs
IMAGE_TO_FESTIVAL_MAPPING = {
    "Baisakhi": "baisakhi",
    "Basant_Panchami": "basant-panchami",
    "Bhai_Dooj": "bhai-dooj",
    "Buddha_Purnima": "buddha-purnima",
    "Chhath_Puja": "chhath-puja",
    "Chinese_New_Year": "chinese-new-year",
    "Diwali": "diwali",
    "Durga_Puja": "durga-puja",
    "Dussehra": "dussehra",
    "Easter": "easter",
    "eid-al-fitr": "eid-al-fitr",
    "Eid_al-Adha": "eid-al-adha",
    "Gandhi_Jayanti": None,  # No Gandhi Jayanti in festivals list
    "Ganesh_Chaturthi": "ganesh-chaturthi",
    "Good-Friday": "good-friday",
    "Guru_Nanak_Jayanti": None,  # No Guru Nanak Jayanti in festivals list
    "Guru_Purnima": "guru-purnima",
    "Halloween": "halloween",
    "Hanukkah": "hanukkah",
    "Happy_New_Year": "new-year",
    "Happy_New_Year_": "new-year",  # Duplicate, will skip
    "Holi": "holi",
    "Independence_Day": "independence-day-india",
    "Janmshtami": "janmashtami",  # Note: typo in filename (Janmshtami instead of Janmashtami)
    "Karwa_Chauth": "karwa-chauth",
    "Kwanzaa": "kwanzaa",
    "Lohri": "lohri",
    "Losar": "losar",
    "Maha_Shivratri": None,  # No Maha Shivratri in festivals list
    "Makar_Sankranti": "makar-sankranti",
    "Mardi_Gras": "mardi-gras",
    "Merry_Christmas": "christmas",
    "Mid-Autumn_Festival": "mid-autumn-festival",
    "Navratri": "navratri",
    "Nowruz": "nowruz",
    "Obon": "obon",
    "Onam": "onam",
    "Pongal": "pongal",
    "Raksha_Bandhan": "raksha-bandhan",
    "Ram_Navami": "ram-navami",
    "Rath_Yatra": "rath-yatra",
    "Republic_day": "republic-day",
    "Songkran": "songkran",
    "Thanksgiving": "thanksgiving",
    "Ugadi": "ugadi",
    "Valentines_Day": "valentines-day",
    "Vasant_Panchami": "basant-panchami",
}


def get_client():
    """Get Supabase admin client"""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
        sys.exit(1)
    
    return create_client(url, key)


def get_image_dimensions(image_path):
    """Get image dimensions using PIL"""
    try:
        with Image.open(image_path) as img:
            return img.size  # Returns (width, height)
    except Exception as e:
        print(f"  ! Could not read image dimensions: {e}")
        return None, None


def seed_festival_images(client, images_dir, bucket_name="festwish-images"):
    """Upload festival images and create database records"""
    print("\n[Seeding Festival Images]")
    
    # Get festival IDs from database
    festivals = client.table("festivals").select("id, slug, name").execute()
    festival_map = {f["slug"]: {"id": f["id"], "name": f["name"]} for f in festivals.data}
    
    print(f"  Found {len(festival_map)} festivals in database")
    
    # Get list of image files
    images_path = Path(images_dir)
    if not images_path.exists():
        print(f"  ! Images directory not found: {images_dir}")
        return
    
    image_files = list(images_path.glob("*.png")) + list(images_path.glob("*.jpg")) + list(images_path.glob("*.jpeg"))
    print(f"  Found {len(image_files)} image files\n")
    
    total_uploaded = 0
    total_skipped = 0
    
    # Create bucket if it doesn't exist (or verify it exists)
    try:
        buckets = client.storage.list_buckets()
        bucket_exists = any(b["name"] == bucket_name for b in buckets)
        if not bucket_exists:
            print(f"  ! Warning: Bucket '{bucket_name}' does not exist. Please create it in Supabase Dashboard.")
            print(f"  ! Go to Storage > Create a new bucket > Name: {bucket_name} > Public bucket: Yes")
            return
    except Exception as e:
        print(f"  ! Could not verify bucket: {e}")
    
    for image_file in image_files:
        filename = image_file.stem  # Filename without extension
        extension = image_file.suffix  # .png, .jpg, etc.
        
        # Get festival slug from mapping
        festival_slug = IMAGE_TO_FESTIVAL_MAPPING.get(filename)
        
        if festival_slug is None:
            if filename in IMAGE_TO_FESTIVAL_MAPPING:
                print(f"  - Skipping {image_file.name} (festival not in database)")
                total_skipped += 1
            else:
                print(f"  ! Unknown image: {image_file.name} (not in mapping)")
                total_skipped += 1
            continue
        
        # Skip duplicate Happy_New_Year_
        if filename == "Happy_New_Year_":
            print(f"  - Skipping duplicate: {image_file.name}")
            total_skipped += 1
            continue
        
        # Get festival ID
        festival_info = festival_map.get(festival_slug)
        if not festival_info:
            print(f"  ! Festival not found for slug: {festival_slug} (image: {image_file.name})")
            total_skipped += 1
            continue
        
        festival_id = festival_info["id"]
        festival_name = festival_info["name"]
        
        # Check if image already exists for this festival
        existing = client.table("festival_images")\
            .select("id")\
            .eq("festival_id", festival_id)\
            .execute()
        
        if existing.data and len(existing.data) > 0:
            print(f"  - Image for '{festival_name}' already exists, skipping...")
            total_skipped += 1
            continue
        
        # Read image file
        try:
            with open(image_file, "rb") as f:
                image_bytes = f.read()
        except Exception as e:
            print(f"  ! Could not read file {image_file.name}: {e}")
            total_skipped += 1
            continue
        
        # Upload to Supabase Storage
        storage_path = f"festival_images/{festival_slug}{extension}"
        
        try:
            # Upload file
            client.storage.from_(bucket_name).upload(
                storage_path,
                image_bytes,
                {"content-type": f"image/{extension[1:]}"}  # image/png, image/jpg
            )
            
            # Get signed URL (valid for 10 years since these are public festival images)
            # Note: For production, make the bucket public instead
            signed_result = client.storage.from_(bucket_name).create_signed_url(
                storage_path, 
                86400 * 3650  # 10 years in seconds
            )
            image_url = signed_result['signedURL']
            
            # Get image dimensions
            width, height = get_image_dimensions(image_file)
            
            # Insert into database
            image_data = {
                "festival_id": festival_id,
                "image_url": image_url,
                "storage_path": storage_path,
                "alt_text": f"{festival_name} festival celebration",
                "is_card_template": True,  # These are template images
                "width": width,
                "height": height,
                "is_active": True
            }
            
            result = client.table("festival_images").insert(image_data).execute()
            
            if result.data:
                print(f"  + Uploaded: {image_file.name} -> {festival_name}")
                total_uploaded += 1
            else:
                print(f"  ! Failed to insert database record for {image_file.name}")
                total_skipped += 1
                
        except Exception as e:
            error_msg = str(e)
            if "Duplicate" in error_msg or "already exists" in error_msg:
                print(f"  - File already exists in storage: {image_file.name}")
                # Try to insert database record anyway
                try:
                    # Get signed URL for existing file
                    signed_result = client.storage.from_(bucket_name).create_signed_url(
                        storage_path, 
                        86400 * 3650  # 10 years
                    )
                    image_url = signed_result['signedURL']
                    width, height = get_image_dimensions(image_file)
                    
                    image_data = {
                        "festival_id": festival_id,
                        "image_url": image_url,
                        "storage_path": storage_path,
                        "alt_text": f"{festival_name} festival celebration",
                        "is_card_template": True,
                        "width": width,
                        "height": height,
                        "is_active": True
                    }
                    
                    result = client.table("festival_images").insert(image_data).execute()
                    if result.data:
                        print(f"    + Added database record for existing file")
                        total_uploaded += 1
                    else:
                        total_skipped += 1
                except Exception as e2:
                    print(f"    ! Could not insert database record: {e2}")
                    total_skipped += 1
            else:
                print(f"  ! Error uploading {image_file.name}: {e}")
                total_skipped += 1
    
    print(f"\n  Summary:")
    print(f"  - Total uploaded: {total_uploaded}")
    print(f"  - Total skipped: {total_skipped}")


def main():
    print("=" * 60)
    print("Festival Images Seeder")
    print("=" * 60)
    
    client = get_client()
    
    # Get project root directory
    project_root = Path(__file__).parent.parent.parent
    images_dir = project_root / "temp" / "festival_images"
    
    print(f"Images directory: {images_dir}")
    
    seed_festival_images(client, images_dir)
    
    print("\n" + "=" * 60)
    print("Image seeding complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
