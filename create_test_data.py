import requests
import time
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8001"

def create_wishlist(name, person):
    response = requests.post(f"{BASE_URL}/wishlists/", json={
        "name": name,
        "person": person
    })
    return response.json()

def add_item(wishlist_id, name, link=""):
    response = requests.post(f"{BASE_URL}/wishlists/{wishlist_id}/items/", json={
        "name": name,
        "link": link
    })
    return response.json()

def mark_purchased(item_id):
    response = requests.post(f"{BASE_URL}/items/{item_id}/purchase")
    return response.json()

def create_test_data():
    # Clear existing data by recreating the database
    print("Creating test wishlists...")
    
    # Gaming Wishlist
    gaming = create_wishlist("Gaming Wishlist", "Alex")
    items = [
        ("Steam Deck", "https://store.steampowered.com/steamdeck"),
        ("Zelda: Tears of the Kingdom", "https://www.nintendo.com/games/detail/the-legend-of-zelda-tears-of-the-kingdom-switch/"),
        ("PS5 DualSense Controller", "https://www.playstation.com/accessories/dualsense-wireless-controller/"),
        ("Gaming Chair", "https://secretlab.co/"),
    ]
    for name, link in items:
        item = add_item(gaming["id"], name, link)
        # Mark some items as purchased
        if name in ["Zelda: Tears of the Kingdom", "Gaming Chair"]:
            mark_purchased(item["id"])
            time.sleep(1)  # Add delay to show different purchase times
    
    # Kitchen Wishlist
    kitchen = create_wishlist("Kitchen Upgrades", "Jamie")
    items = [
        ("KitchenAid Stand Mixer", "https://www.kitchenaid.com/countertop-appliances/stand-mixers/"),
        ("Le Creuset Dutch Oven", "https://www.lecreuset.com/dutch-ovens-braisers"),
        ("Chef's Knife", "https://www.wusthof.com/"),
        ("Espresso Machine", "https://www.breville.com/us/en/products/espresso.html"),
        ("Air Fryer", "https://www.ninja.com/air-fryers"),
    ]
    for name, link in items:
        item = add_item(kitchen["id"], name, link)
        if name in ["Chef's Knife", "Air Fryer"]:
            mark_purchased(item["id"])
            time.sleep(1)
    
    # Books Wishlist
    books = create_wishlist("Reading List", "Sam")
    items = [
        ("Project Hail Mary", "https://www.goodreads.com/book/show/54493401-project-hail-mary"),
        ("Dune", "https://www.goodreads.com/book/show/44767458-dune"),
        ("The Pragmatic Programmer", "https://www.goodreads.com/book/show/4099.The_Pragmatic_Programmer"),
        ("The Design of Everyday Things", "https://www.goodreads.com/book/show/840.The_Design_of_Everyday_Things"),
    ]
    for name, link in items:
        item = add_item(books["id"], name, link)
        if name == "Dune":
            mark_purchased(item["id"])
            time.sleep(1)

    print("Test data created successfully!")
    print("\nCreated Wishlists:")
    print("1. Gaming Wishlist for Alex")
    print("   - Steam Deck (not purchased)")
    print("   - Zelda: Tears of the Kingdom (purchased)")
    print("   - PS5 DualSense Controller (not purchased)")
    print("   - Gaming Chair (purchased)")
    print("\n2. Kitchen Upgrades for Jamie")
    print("   - KitchenAid Stand Mixer (not purchased)")
    print("   - Le Creuset Dutch Oven (not purchased)")
    print("   - Chef's Knife (purchased)")
    print("   - Espresso Machine (not purchased)")
    print("   - Air Fryer (purchased)")
    print("\n3. Reading List for Sam")
    print("   - Project Hail Mary (not purchased)")
    print("   - Dune (purchased)")
    print("   - The Pragmatic Programmer (not purchased)")
    print("   - The Design of Everyday Things (not purchased)")

if __name__ == "__main__":
    create_test_data()
