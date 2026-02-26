const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false },
);

const tableSchema = new mongoose.Schema(
  {
    tableName: { type: String, required: true },
    columns: { type: [columnSchema], required: true },
  },
  { _id: false },
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    description: { type: String, required: true },

    question: { type: String, required: true },

    postgresSchemaName: {
      type: String,
      required: true,
      unique: true,
    },

    tables: { type: [tableSchema], required: true },

    samplePreview: { type: mongoose.Schema.Types.Mixed, default: {} },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
