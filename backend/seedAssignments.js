require("dotenv").config();
const mongoose = require("mongoose");
const Assignment = require("./src/models/assignment.model");

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected for seeding");
};

const assignments = [
  {
    title: "Find High Salary Employees",
    difficulty: "easy",
    description: "Basic filtering using WHERE clause",
    question: "List all employees earning more than 50,000",
    postgresSchemaName: "high_salary_employees",

    tables: [
      {
        tableName: "employees",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "salary", type: "INTEGER" },
          { name: "department", type: "TEXT" },
        ],
      },
    ],

    samplePreview: [
      { id: 2, name: "Bob", salary: 60000, department: "Engineering" },
      { id: 3, name: "Charlie", salary: 75000, department: "Engineering" },
    ],
  },

  {
    title: "Department-wise Employee Count",
    difficulty: "medium",
    description: "Aggregation using GROUP BY",
    question: "Find the number of employees in each department",
    postgresSchemaName: "dept_employee_count",

    tables: [
      {
        tableName: "employees",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "department", type: "TEXT" },
        ],
      },
    ],

    samplePreview: [
      { department: "HR", count: 1 },
      { department: "Engineering", count: 2 },
      { department: "Sales", count: 2 },
    ],
  },

  {
    title: "Total Order Value per Customer",
    difficulty: "medium",
    description: "JOIN and aggregation",
    question: "Find total order value for each customer",
    postgresSchemaName: "total_order_value",

    tables: [
      {
        tableName: "customers",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
        ],
      },
      {
        tableName: "orders",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "customer_id", type: "INTEGER" },
          { name: "amount", type: "REAL" },
        ],
      },
    ],

    samplePreview: [
      { name: "Aman", total_amount: 2000.5 },
      { name: "Saurabh", total_amount: 1500.0 },
    ],
  },

  {
    title: "Highest Paid Employee",
    difficulty: "hard",
    description: "Subquery or MAX aggregation",
    question: "Find the employee(s) with the highest salary",
    postgresSchemaName: "highest_paid_employee",

    tables: [
      {
        tableName: "employees",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "salary", type: "INTEGER" },
        ],
      },
    ],

    samplePreview: [
      { id: 2, name: "Bob", salary: 85000 },
      { id: 3, name: "Charlie", salary: 85000 },
    ],
  },
];
const seed = async () => {
  try {
    await connectDB();

    await Assignment.deleteMany({});
    await Assignment.collection.dropIndexes().catch(() => {});
    await Assignment.syncIndexes();

    await Assignment.insertMany(assignments);

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};
seed();
