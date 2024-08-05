import pymongo
from bson.objectid import ObjectId
import random
from datetime import datetime
from faker import Faker

# Database connection
client = pymongo.MongoClient("mongodb+srv://capstone883:Capstone123@cluster0.bq8yack.mongodb.net/PetPooja?retryWrites=true&w=majority")
db = client.PetPoojaDB

# Initialize Faker for generating sample data
fake = Faker()

# Drop existing collections if they exist
collections = ["Users", "Restaurants", "Products", "Categories", "Orders", "OrderStatus", "Deliveries", "Payments", "Notifications"]
for collection in collections:
    db[collection].drop()

# Create Users collection with Admin, Merchant, and Customer roles
users = []
for _ in range(5):
    users.append({
        "username": fake.user_name(),
        "password": fake.password(),
        "role": "Admin",
        "email": fake.email(),
        "phone": fake.phone_number(),
    })

for _ in range(10):
    users.append({
        "username": fake.user_name(),
        "password": fake.password(),
        "role": "Merchant",
        "email": fake.email(),
        "phone": fake.phone_number(),
    })

for _ in range(20):
    users.append({
        "username": fake.user_name(),
        "password": fake.password(),
        "role": "Customer",
        "email": fake.email(),
        "phone": fake.phone_number(),
    })

user_ids = db.Users.insert_many(users).inserted_ids

# Ensure there are Customers and Merchants in the DB
if not any(db.Users.find({"role": "Customer"})):
    raise ValueError("No Customer users found in the database.")
if not any(db.Users.find({"role": "Merchant"})):
    raise ValueError("No Merchant users found in the database.")

# Create Restaurants collection
restaurants = []
for _ in range(10):
    restaurants.append({
        "restaurantName": fake.company(),
        "address": {
            "street": fake.street_address(),
            "city": fake.city(),
            "province": fake.state_abbr(),
            "zipcode": fake.zipcode()
        },
        "phone": fake.phone_number(),
        "registrationNumber": fake.uuid4(),
        "isActive": True,
        "timings": f"{random.randint(8, 10)}:00 AM - {random.randint(8, 11)}:00 PM"
    })

restaurant_ids = db.Restaurants.insert_many(restaurants).inserted_ids

# Create Categories collection
categories = []
for _ in range(10):
    categories.append({
        "name": fake.word(),
        "image": fake.image_url(),
        "productCount": 0
    })

category_ids = db.Categories.insert_many(categories).inserted_ids

# Create Products collection
products = []
for _ in range(20):
    category_id = random.choice(category_ids)
    merchant_id = random.choice([uid for uid in user_ids if db.Users.find_one({"_id": uid, "role": "Merchant"})])
    product = {
        "name": fake.word(),
        "price": round(random.uniform(5.99, 99.99), 2),
        "category": ObjectId(category_id),
        "image": fake.image_url(),
        "isActive": True,
        "merchant": ObjectId(merchant_id),
        "reviews": []
    }
    products.append(product)

product_ids = db.Products.insert_many(products).inserted_ids

# Update product count in categories
for category_id in category_ids:
    product_count = db.Products.count_documents({"category": category_id})
    db.Categories.update_one({"_id": category_id}, {"$set": {"productCount": product_count}})

# Create Orders and OrderStatus collections
orders = []
order_statuses = []
for _ in range(30):
    user_id = random.choice([uid for uid in user_ids if db.Users.find_one({"_id": uid, "role": "Customer"})])
    product_id = random.choice(product_ids)
    order = {
        "user": ObjectId(user_id),
        "items": [db.Products.find_one({"_id": product_id})["name"]],
        "total": round(random.uniform(10.00, 500.00), 2),
        "status": "Pending",
        "createdAt": datetime.now().isoformat(),
    }
    order_id = db.Orders.insert_one(order).inserted_id

    order_status = {
        "order": ObjectId(order_id),
        "status": "Pending",
        "updatedAt": datetime.now().isoformat()
    }
    order_statuses.append(order_status)

db.OrderStatus.insert_many(order_statuses)

# Create Deliveries collection
deliveries = []
for _ in range(20):
    order_id = random.choice([order["_id"] for order in db.Orders.find()])
    delivery = {
        "order": ObjectId(order_id),
        "deliveryStatus": "Pending",
        "assignedTo": fake.name(),
        "estimatedDeliveryTime": f"{random.randint(10, 30)} mins"
    }
    deliveries.append(delivery)

db.Deliveries.insert_many(deliveries)

# Create Payments collection
payments = []
for _ in range(30):
    order_id = random.choice([order["_id"] for order in db.Orders.find()])
    payment = {
        "order": ObjectId(order_id),
        "amount": db.Orders.find_one({"_id": order_id})["total"],
        "paymentStatus": "Completed",
        "paymentMethod": random.choice(["Credit Card", "Debit Card", "UPI", "Cash"])
    }
    payments.append(payment)

db.Payments.insert_many(payments)

# Create Notifications collection
notifications = []
for _ in range(30):
    user_id = random.choice(user_ids)
    notification = {
        "user": ObjectId(user_id),
        "message": fake.sentence(),
        "sentAt": datetime.now().isoformat()
    }
    notifications.append(notification)

db.Notifications.insert_many(notifications)

# List of collections to count documents in
collections = ["Users", "Restaurants", "Products", "Categories", "Orders", "OrderStatus", "Deliveries", "Payments", "Notifications"]

# Verification
collections_with_counts = {collection: db[collection].count_documents({}) for collection in collections}
print(collections_with_counts)
