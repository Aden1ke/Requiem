import { Router } from "express"
import { z } from "zod"
import { validate } from "../middleware/validate"
import { generateEulogy } from "@requiem/ai-engine"
export const eulogyRouter = Router()
eulogyRouter.post("/preview", validate(z.object({
  name: z.string().min(1),
  born: z.number().int(),
  died: z.number().int(),
  cause_of_death: z.enum(["killed_by_google","murdered_by_microsoft","died_of_neglect","acquired_and_buried","disrupted_to_death","deprecated","ran_out_of_funding","replaced_by_better","feature_creep_asphyxiation","security_breach_trauma","technical_debt_collapse","pivot_to_ai_casualty","Sold & Lost Shine","Spent All Funding","pivoted_to_oblivion"]),
})), async (req, res) => res.json(await generateEulogy(req.body)))
