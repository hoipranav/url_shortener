from fastapi import FastAPI, HTTPException, responses
from pydantic import BaseModel
import redis, redis.exceptions, secrets, string
from fastapi.middleware.cors import CORSMiddleware
import os


app = FastAPI()
redis_host = os.environ.get("REDIS_HOST", "localhost")
redis_port = int(os.environ.get("REDIS_PORT", 6379))
r = redis.Redis(host=redis_host, port=redis_port, db=0)
origins = ["http://localhost:5173",]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class URL(BaseModel):
    long_url: str


def generate_short_code(length: int = 8) -> str:
    chars = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(chars) for _ in range(length))


@app.get('/')
async def root():
    return {'message':'hello, world!'}


@app.get('/test-redis')
async def test_redis():
    try:
        r.set('test_key', 'it works')
        value = r.get('test_key').decode('utf-8')
        return {'redis_test':value}
    except redis.exceptions.ConnectionError as e:
        return {'error':str(e)}
    

@app.post('/shorten')
async def shorten_url(url: URL):
    short_code = generate_short_code()

    r.set(short_code, url.long_url)
    return {'short_url': f'http://localhost:8000/{short_code}'}


@app.get('/{short_code}')
async def redirect_short_url(short_code: str):
    long_url = r.get(short_code)

    if long_url is None:
        raise HTTPException(status_code=404, detail='Short URL not found')
    
    return responses.RedirectResponse(url=long_url.decode('utf-8'), status_code=307)