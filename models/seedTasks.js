const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017"; // your MongoDB URI
const dbName = "sales_management";        // your database name

// User IDs from your db.users.find() output
const users = {
  karthi: ObjectId("68f09737488b5a62d97b546f"),
  bruntha: ObjectId("68f0c58d94c106fc9bc7150b")
};

const tasks = [
  {
    title: "Follow up with ABC Corp",
    description: "Call client regarding order status",
    assignedTo: users.karthi,
    assignedBy: users.bruntha,
    status: "pending",
    clientName: "ABC Corp",
    clientEmail: "client@abc.com",
    products: [],
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    media: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Send invoice to XYZ Ltd",
    description: "Prepare invoice and send via email",
    assignedTo: users.karthi,
    assignedBy: users.bruntha,
    status: "pending",
    clientName: "XYZ Ltd",
    clientEmail: "xyz@company.com",
    products: [],
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    media: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Update product catalog",
    description: "Add new products and images",
    assignedTo: users.karthi,
    assignedBy: users.bruntha,
    status: "pending",
    clientName: "",
    clientEmail: "",
    products: [],
    location: { type: "Point", coordinates: [77.5946, 12.9716] },
    media: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedTasks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("tasks");

    const result = await collection.insertMany(tasks);
    console.log(`Inserted ${result.insertedCount} tasks successfully!`);
  } catch (err) {
    console.error("Error seeding tasks:", err);
  } finally {
    await client.close();
  }
}

seedTasks();
