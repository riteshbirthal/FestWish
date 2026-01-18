# FestWish Static Data

This directory contains **static festival data** that was previously stored in the database. Moving this data to the frontend provides instant loading with no API calls.

## 📁 Files

### JSON Data Files (Auto-generated)
- **`festivals.json`** (~80 KB) - All 42 festivals with complete information
- **`relationships.json`** (~8 KB) - All 29 relationship types
- **`messageTemplates.json`** (~5.6 MB) - 40,000+ pre-generated messages
- **`quotes.json`** (~15 KB) - 114 festival quotes

### JavaScript Wrapper Files
- **`festivals.js`** - Helper functions for festival data
- **`relationships.js`** - Helper functions for relationships
- **`messageTemplates.js`** - Functions for random message selection
- **`quotes.js`** - Functions for random quote selection

## 🔄 Updating Data

If you need to update the static data (add festivals, messages, etc.):

### Option 1: Update Database & Re-export
1. Update the data in Supabase database
2. Run the export script:
   ```bash
   cd backend
   python export_data.py
   ```
3. Commit the updated JSON files

### Option 2: Edit JSON Files Directly
1. Edit the JSON files in this directory
2. Ensure proper formatting and structure
3. Test thoroughly before committing

## ⚡ Performance Benefits

### Before (Database API calls):
```
- Festival list: 200ms API call
- Relationships: 150ms API call  
- Random content: 250ms API call
Total: ~600ms of loading time per page
```

### After (Static frontend data):
```
- Festival list: 0ms (instant)
- Relationships: 0ms (instant)
- Random content: 0ms (instant, client-side)
Total: 0ms - instant loading!
```

## 📦 Bundle Size Impact

- **Total added**: ~5.7 MB of JSON data
- **Compressed (gzip)**: ~1.2 MB
- **Impact**: Acceptable for modern web apps
- **Benefit**: Eliminates 10+ API calls per user session

## 🎯 What Stays in Database

The following data **remains in the database**:
- ✅ Festival images (84 MB - too large for bundle)
- ✅ User wishes and history
- ✅ Generated greeting cards
- ✅ User uploaded images
- ✅ Authentication data

## 🛠️ Usage Examples

### Get All Festivals
```javascript
import { FESTIVALS } from '@/data/festivals'

// Direct access - instant!
const allFestivals = FESTIVALS
```

### Get Random Message
```javascript
import { getRandomMessage } from '@/data/messageTemplates'

const message = getRandomMessage('diwali', 'Father')
// Returns: { text: "...", tone: "warm" }
```

### Search Festivals
```javascript
import { searchFestivals } from '@/data/festivals'

const results = searchFestivals('diwali')
```

## 📝 Notes

- Data is frozen at build time - updates require rebuild
- Perfect for content that rarely changes
- Images still loaded on-demand from CDN (Supabase Storage)
- Random selection happens client-side for infinite variety
