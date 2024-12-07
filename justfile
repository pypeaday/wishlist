build:
    docker build -t wishlist .
serve:
    docker run -p 8001:8000 -v $(pwd):/app/ wishlist 
