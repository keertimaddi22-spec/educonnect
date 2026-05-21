import express from "express";

import {
  getAssignments,
  createAssignment,
  deleteAssignment,
  submitAssignment,
  returnAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();


router.get("/", getAssignments);


router.post("/", createAssignment);


router.delete("/:id", deleteAssignment);


router.post("/submit/:id", submitAssignment);


router.put("/return/:id", returnAssignment);


export default router;