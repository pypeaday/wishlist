# 🎁 Wishlist App

A modern, responsive wishlist application built with FastAPI and TailwindCSS. Create and manage multiple wishlists for different people, track items, and mark them as purchased. Features a beautiful dark/light theme with smooth transitions and a clean, minimalist interface.

## 📸 Screenshots

### Dark Theme
![Dark Theme](screenshots/dark-theme.png)
*Dark theme with a wishlist expanded, showing items and the purchase status*

### Light Theme
![Light Theme](screenshots/light-theme.png)
*Light theme showing multiple wishlists and the create wishlist form*

### Mobile View
![Mobile View](screenshots/mobile-view.png)
*Responsive mobile view with the theme toggle*

## ✨ Features

- 📝 Create multiple wishlists for different people
- 🔗 Add items with links to where they can be purchased
- ✅ Mark items as purchased
- 🌓 Beautiful dark/light theme with smooth transitions
- 💾 Theme preference persists across sessions
- 📱 Fully responsive design
- 🎨 Modern UI with subtle animations and transitions
- 🔒 SQLite database for data persistence

## 🚀 Getting Started

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wishlist.git
cd wishlist
```

2. Create a virtual environment (recommended):
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
uvicorn main:app --reload
```

5. Open your browser and navigate to:
```
http://localhost:8000
```

## 🛠️ Technical Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **SQLite**: Lightweight, serverless database

### Frontend
- **TailwindCSS**: Utility-first CSS framework
- **Vanilla JavaScript**: Clean, modern JavaScript without dependencies
- **Inter Font**: Beautiful, readable typography
- **HTML5**: Semantic markup

## 🎨 Theme System

The app features a sophisticated theming system with carefully chosen colors for both dark and light modes:

### Dark Theme
- Background: Deep space blue (#171923)
- Surface: Lighter space blue (#2A313C)
- Primary: Soft nordic blue (#81A1C1)
- Text: Nordic snow white (#ECEFF4)

### Light Theme
- Background: Soft white (#f5f5f4)
- Surface: Pure white (#ffffff)
- Primary: Muted blue (#5c7b9a)
- Text: Deep gray (#3c4148)

## 📁 Project Structure

```
wishlist/
├── main.py           # FastAPI application and routes
├── models.py         # SQLAlchemy models
├── schemas.py        # Pydantic schemas
├── static/
│   └── script.js    # Frontend JavaScript
├── index.html       # Main HTML template
├── requirements.txt # Python dependencies
└── README.md       # Project documentation
```

## 🔄 API Endpoints

The application provides a RESTful API for managing wishlists and items:

- `GET /api/wishlists`: Get all wishlists
- `POST /api/wishlists`: Create a new wishlist
- `GET /api/wishlists/{id}`: Get a specific wishlist
- `POST /api/wishlists/{id}/items`: Add an item to a wishlist
- `PUT /api/items/{id}`: Update an item (e.g., mark as purchased)
- `DELETE /api/items/{id}`: Delete an item

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TailwindCSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [FastAPI](https://fastapi.tiangolo.com/) for the modern Python web framework
- [Inter Font](https://rsms.me/inter/) for the beautiful typography
- [Codeium](https://codeium.com/) for powering intelligent code assistance and generation
- Special thanks to Cascade, the agentic AI assistant in Windsurf IDE, for pair programming support
