from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

fake_users_db = {
    "admin@example.com": {
        "password": pwd_context.hash(""),
        "role": "admin"
    },
    "user@example.com": {
        "password": pwd_context.hash(""),
        "role": "user"
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

class SOSData(BaseModel):
    email: str
    lat: float
    lon: float
    message: str
    timestamp: str

sos_data_list = []

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({
        "sub": form_data.username,
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}

@app.post("/sos")
def send_sos(data: SOSData):
    sos_data_list.append(data.dict())
    return {"message": "SOS received"}

@app.get("/sos-data")
def get_sos_data(request: Request):
    token = request.headers.get("Authorization").split(" ")[1]
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return sos_data_list