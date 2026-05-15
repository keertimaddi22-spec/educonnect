import Assignment from "../models/Assignment.js";


// ✅ GET ALL
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();

    res.json(assignments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// ✅ CREATE
export const createAssignment = async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    const newAssignment = new Assignment({
      title,
      dueDate,
      submissions: [],
    });

    await newAssignment.save();

    res.json(newAssignment);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// ✅ DELETE
export const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);

    res.json({
      message: "Assignment deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// ✅ SUBMIT
export const submitAssignment = async (req, res) => {
  try {
    const { student, answer } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    // prevent duplicate
    const alreadySubmitted = assignment.submissions.find(
      (s) => s.student === student
    );

    if (alreadySubmitted) {
      return res.status(400).json({
        message: "Already submitted",
      });
    }

    assignment.submissions.push({
      student,
      answer,
      status: "submitted",
    });

    await assignment.save();

    res.json(assignment);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


// ✅ RETURN
export const returnAssignment = async (req, res) => {
  try {
    const { student } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    assignment.submissions = assignment.submissions.map((s) => {
      if (s.student === student) {
        return {
          ...s._doc,
          status: "returned",
        };
      }

      return s;
    });

    await assignment.save();

    res.json(assignment);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};