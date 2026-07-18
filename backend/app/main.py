from fastapi import FastAPI

app = FastAPI(
    title="Samsung India API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Samsung India Backend is Running 🚀"
    }