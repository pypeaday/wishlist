# 🎁 Wishlist App

A modern, responsive wishlist application built with FastAPI and Bootstrap. Create and manage multiple wishlists for different people, track items, and mark them as purchased. Features a clean dark theme, user authentication, and separate creator/viewer interfaces.

## ✨ Features

### 👥 User Roles
- **Creator Mode**
  - 📝 Create and manage multiple wishlists
  - 🔗 Add items with links to where they can be purchased
  - 🗑️ Delete items and wishlists
  - 🔄 Easy switching between creator and viewer modes
  - 🔒 Secure authentication required

- **Viewer Mode**
  - 👀 View all available wishlists
  - ✅ Mark items as purchased (with confirmation)
  - ↩️ Unmark purchases if made by mistake
  - 📅 See when items were purchased
  - 🔓 No login required

### 💫 UI Features
- 🌙 Beautiful dark theme
- 📱 Fully responsive design
- 🎨 Modern Bootstrap UI
- ⚡ Collapsible wishlists that maintain state
- 💭 Helpful tooltips and instructions
- ✔️ Purchase confirmation dialogs
- 🔄 Smooth transitions and animations

### 🛠️ Technical Features
- 🔒 JWT-based authentication
- 📊 SQLite database for data persistence
- 🔐 Secure password hashing
- 🎯 Clear separation of creator/viewer interfaces
- 🔄 RESTful API endpoints
- 📱 Mobile-first responsive design

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wishlist.git
cd wishlist
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database:
```bash
python reset_db.py
```

4. Run the application:
```bash
python app.py
```

### Configuration

The app can be configured using environment variables:

- `WISHLIST_PORT`: Port to run the server on (default: 8000)
- `WISHLIST_HOST`: Host to bind to (default: 0.0.0.0)
- `WISHLIST_DB_PATH`: Path to SQLite database file (default: ./data/wishlists.db)
- `SECRET_KEY`: Secret key for JWT token generation (required for auth)

## 🏗️ Project Structure

```
wishlist/
├── app.py            # FastAPI application and routes
├── auth.py           # Authentication logic
├── database.py       # Database configuration
├── models.py         # SQLAlchemy models
├── schemas.py        # Pydantic schemas
├── templates/
│   ├── creator.html  # Creator interface
│   ├── viewer.html   # Viewer interface
│   ├── login.html    # Login page
│   └── register.html # Registration page
├── static/
│   └── styles/       # CSS styles
└── data/
    └── wishlists.db  # SQLite database
```

## 🔒 Authentication

The app uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in HTTP-only cookies
- Passwords are securely hashed using bcrypt
- Protected routes require valid JWT tokens
- Automatic redirection to login for unauthorized access

## 🎯 Usage

1. **As a Creator:**
   - Register/Login to access creator mode
   - Create wishlists for different people/occasions
   - Add items with optional purchase links
   - Switch to viewer mode to see the public view
   - Share the viewer link with others

2. **As a Viewer:**
   - No login required
   - View all available wishlists
   - Mark items as purchased
   - See when items were purchased
   - Unmark purchases if needed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
