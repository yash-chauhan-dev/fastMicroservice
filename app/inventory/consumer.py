import time

from main import Product, redis

key = "order_completed"
group = "inventory-group"

try:
    redis.xgroup_create(key, group, mkstream=True)
except Exception:
    print("Group already exist!!")


while True:
    try:
        results = redis.xreadgroup(group, key, {key: ">"}, None)

        if results != []:
            for result in results:
                obj = result[1][0][1]
                product = Product.get(obj["product_id"])
                print(product)
                if int(obj["quantity"]) <= product.quantity:
                    product.quantity = product.quantity - int(obj["quantity"])
                    product.save()
                else:
                    redis.xadd("refund_order", obj, "*")
    except Exception:
        redis.xadd("refund_order", obj, "*")
    time.sleep(1)
