import requests
import time
from datetime import datetime, timedelta
from database import SessionLocal
import auth
import models

BASE_URL = "http://localhost:8001"

def create_test_user():
    # Create test user in database directly
    db = SessionLocal()
    try:
        # Check if test user already exists
        test_user = db.query(models.User).filter(models.User.username == "testuser").first()
        if test_user:
            return test_user
        
        # Create new test user
        test_user = models.User(
            username="testuser",
            email="test@example.com",
            hashed_password=auth.get_password_hash("testpass123"),
            is_active=True
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        return test_user
    finally:
        db.close()

def get_auth_token():
    # Use requests.Session() to handle redirects and cookies
    session = requests.Session()
    login_data = {
        "username": "testuser",
        "password": "testpass123",
        "grant_type": "password"
    }
    
    # First request to get the login page and any CSRF tokens if needed
    response = session.get(f"{BASE_URL}/login")
    
    # Post login data
    response = session.post(
        f"{BASE_URL}/login",
        data=login_data,
        allow_redirects=False  # Don't follow the redirect
    )
    
    if response.status_code != 303:
        raise Exception(f"Login failed with status {response.status_code}: {response.text}")
    
    # Get the access token from cookies
    cookies = session.cookies
    auth_token = cookies.get("access_token")
    if not auth_token:
        raise Exception("No access token in response cookies")
    
    return auth_token

def create_wishlist(name, person, auth_token):
    response = requests.post(
        f"{BASE_URL}/api/wishlists",
        json={"name": name, "person": person},
        cookies={"access_token": auth_token}
    )
    if response.status_code != 200:
        raise Exception(f"Failed to create wishlist: {response.text}")
    return response.json()

def add_item(wishlist_id, name, link="", auth_token=""):
    response = requests.post(
        f"{BASE_URL}/api/wishlists/{wishlist_id}/items",
        json={"name": name, "link": link},
        cookies={"access_token": auth_token}
    )
    if response.status_code != 200:
        raise Exception(f"Failed to add item: {response.text}")
    return response.json()

def mark_purchased(item_id, auth_token):
    response = requests.post(
        f"{BASE_URL}/api/items/{item_id}/purchase",
        cookies={"access_token": auth_token}
    )
    if response.status_code != 200:
        raise Exception(f"Failed to mark item as purchased: {response.text}")
    return response.json()

def create_test_data():
    print("Creating test user...")
    create_test_user()
    
    print("Getting auth token...")
    auth_token = get_auth_token()
    
    print("Creating test wishlists...")
    
    # Gaming Wishlist
    gaming = create_wishlist("Gaming Wishlist", "Alex", auth_token)
    items = [
        ("Steam Deck", "https://store.steampowered.com/steamdeck"),
        ("Zelda: Tears of the Kingdom", "https://www.nintendo.com/games/detail/the-legend-of-zelda-tears-of-the-kingdom-switch/"),
        ("PS5 DualSense Controller", "https://www.playstation.com/accessories/dualsense-wireless-controller/"),
        ("Gaming Chair", "https://secretlab.co/"),
    ]
    for name, link in items:
        item = add_item(gaming["id"], name, link, auth_token)
        # Mark some items as purchased
        if name in ["Zelda: Tears of the Kingdom", "Gaming Chair"]:
            mark_purchased(item["id"], auth_token)
            time.sleep(1)  # Add delay to show different purchase times
    
    # Kitchen Wishlist
    kitchen = create_wishlist("Kitchen Upgrades", "Jamie", auth_token)
    items = [
        ("KitchenAid Stand Mixer", "https://www.kitchenaid.com/countertop-appliances/stand-mixers/"),
        ("Le Creuset Dutch Oven", "https://www.lecreuset.com/dutch-ovens-braisers"),
        ("Chef's Knife", "https://www.wusthof.com/"),
        ("Espresso Machine", "https://www.breville.com/us/en/products/espresso.html"),
        ("Air Fryer", "https://www.ninja.com/air-fryers"),
    ]
    for name, link in items:
        item = add_item(kitchen["id"], name, link, auth_token)
        if name in ["Chef's Knife"]:
            mark_purchased(item["id"], auth_token)
            time.sleep(1)

    # Books Wishlist
    books = create_wishlist("Book List", "Sam", auth_token)
    items = [
        ("Project Hail Mary", "https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202"),
        ("Dune", "https://www.amazon.com/Dune-Frank-Herbert/dp/0441172717"),
        ("The Midnight Library", "https://www.amazon.com/Midnight-Library-Matt-Haig/dp/0525559474"),
        ("Klara and the Sun", "https://www.amazon.com/Klara-Sun-novel-Kazuo-Ishiguro/dp/059331817X"),
    ]
    for name, link in items:
        item = add_item(books["id"], name, link, auth_token)
        if name in ["Dune"]:
            mark_purchased(item["id"], auth_token)
            time.sleep(1)

    print("Test data created successfully!")

if __name__ == "__main__":
    create_test_data()
