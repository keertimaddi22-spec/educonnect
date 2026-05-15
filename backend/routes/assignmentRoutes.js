import express from "express";

import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  submitAssignment,
  returnAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();


// ✅ GET
router.get("/", getAssignments);


// ✅ CREATE
router.post("/", createAssignment);


// ✅ DELETE
router.delete("/:id", deleteAssignment);


// ✅ SUBMIT
router.post("/submit/:id", submitAssignment);


// ✅ RETURN
router.put("/return/:id", returnAssignment);


export default router;