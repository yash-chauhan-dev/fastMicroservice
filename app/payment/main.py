import os
import time

import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.background import BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from redis_om import HashModel, get_redis_connection
from starlette.requests import Request

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_SERVER_DOMAIN")],
    allow_methods=["*"],
    allow_headers=["*"]
)

redis = get_redis_connection(
    host=os.environ.get("REDIS_CONNECT_URL"),
    port=os.environ.get("REDIS_PORT"),
    password=os.environ.get("REDIS_PASSWORD"),
    decode_responses=True
)


class Order(HashModel):
    product_id: str
    price: float
    fee: float
    total: float
    quantity: int
    status: str  # pending, completed, refunded

    class Meta:
        database = redis


@app.get("/orders")
async def get():
    order_list = [format(pk) for pk in Order.all_pks()]
    number_orders = len(order_list)
    return {
        "orders": number_orders,
        "data": order_list
    }


def format(pk: str):
    order = Order.get(pk)

    return {
        "id": order.pk,
        "quantity": order.quantity,
        "status": order.status
    }


@app.post("/orders")
async def create(request: Request, background_task: BackgroundTasks):
    body = await request.json()

    req = requests.get("%s/products/%s"
                       % (
                           str(os.environ.get("INVENTORY_SERVER_DOMAIN")),
                           body["id"]
                       ))
    product = req.json()

    order = Order(
        product_id=body["id"],
        price=product["price"],
        fee=0.2 * product["price"],
        total=1.2 * product["price"],
        quantity=int(body["quantity"]),
        status="pending"
    )
    order.save()

    background_task.add_task(order_completed, order)

    return order


def order_completed(order: Order):
    time.sleep(5)
    order.status = "completed"
    order.save()
    redis.xadd("order_completed", order.dict(), "*")
