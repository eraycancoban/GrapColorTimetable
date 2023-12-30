import express from "express";
import  {db} from "../db.js";
import { komsulukCikar,getProgram,studentProgram} from "../controllers/graphColoring.js"

const router = express.Router();

router.get("/k",komsulukCikar)
router.get("/p",getProgram)
router.get("/studentProgram/:id",studentProgram)
export default router;