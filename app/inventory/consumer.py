import time

from main import Product, redis

key = "order_completed"
group = "inventory-group"

try:
    redis.xgroup_create(key, group)
except Exception:
    print("Group already exist!!")


while True:
    try:
        results = redis.xreadgroup(group, key, {key: ">"}, None)

        if results != []:
            for result in results:
                obj = result[1][0][1]
                product = Product.get(obj["product_id"])
                try:
                    print(product)
                    product.quantity = product.quantity - int(obj["quantity"])
                    product.save()
                except Exception:
                    redis.xadd("refund_order", obj, "*")
    except Exception as e:
        print(str(e))
    time.sleep(1)
