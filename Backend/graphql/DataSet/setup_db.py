import pymongo

# Database connection
client = pymongo.MongoClient("mongodb+srv://capstone883:Capstone123@cluster0.bq8yack.mongodb.net/PetPoojaDB?retryWrites=true&w=majority")
db = client.PetPoojaDB

# List of collections to create
collections = ["Users", "Restaurants", "Products", "Categories", "Orders", "OrderStatus", "Deliveries", "Payments", "Notifications"]

# Create empty collections
for collection in collections:
    db.create_collection(collection)

print("Collections created successfully.")
