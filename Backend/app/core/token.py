# from datetime import datetime, timedelta
# from jose import jwt
# from passlib.context import CryptContext
# from app.core.config import settings

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def create_access_token(user_id: str, expires_minutes: int = None):
#     expire = datetime.utcnow() + timedelta(
#         minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
#     )
#     payload = {"sub": user_id, "exp": expire}
#     token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
#     return token

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)
