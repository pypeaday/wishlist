import sqlite3
from datetime import datetime

def migrate_database():
    conn = sqlite3.connect('wishlists.db')
    cursor = conn.cursor()
    
    # Check if purchase_date column exists
    cursor.execute("PRAGMA table_info(items)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'purchase_date' not in columns:
        print("Adding purchase_date column...")
        cursor.execute("""
            ALTER TABLE items
            ADD COLUMN purchase_date TIMESTAMP
        """)
        
        # Update existing purchased items with current timestamp
        cursor.execute("""
            UPDATE items
            SET purchase_date = ?
            WHERE purchased = 1
        """, (datetime.now(),))
        
        conn.commit()
        print("Migration completed successfully!")
    else:
        print("purchase_date column already exists")
    
    conn.close()

if __name__ == "__main__":
    migrate_database()
