import { Router } from "express"
import { z } from "zod"
import { validate } from "../middleware/validate"
import { supabase } from "../lib/supabase"
import { generateEulogy } from "@requiem/ai-engine"
export const techRouter = Router()
techRouter.get("/", async (req, res) => {
  const page = Number(req.query.page ?? 1), limit = Number(req.query.limit ?? 20), from = (page-1)*limit
  const { data, error, count } = await supabase.from("dead_tech").select("*",{count:"exact"}).order("created_at",{ascending:false}).range(from,from+limit-1)
  if (error) return res.status(500).json({ error: error.message })
  return res.json({ data, count, page, limit })
})
techRouter.get("/:slug", async (req, res) => {
  const { data, error } = await supabase.from("dead_tech").select("*, tributes(*)").eq("slug",req.params.slug).single()
  if (error) return res.status(404).json({ error: "Not found in the graveyard" })
  return res.json(data)
})
const submitSchema = z.object({
  name: z.string().min(1).max(100),
  born: z.number().int().min(1900).max(2030),
  died: z.number().int().min(1900).max(2030),
  cause_of_death: z.enum(["killed_by_google","murdered_by_microsoft","died_of_neglect","acquired_and_buried","disrupted_to_death","deprecated","ran_out_of_funding","replaced_by_better"]),
  context: z.string().max(500).optional(),
})
techRouter.post("/", validate(submitSchema), async (req, res) => {
  const eulogy = await generateEulogy(req.body)
  const slug = req.body.name.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")
  const { data, error } = await supabase.from("dead_tech").insert({...req.body,slug,eulogy:eulogy.eulogy,epitaph:eulogy.epitaph,gravestone_style:eulogy.gravestone_style,tribute_count:0}).select().single()
  if (error) return res.status(500).json({ error: error.message })
  return res.status(201).json(data)
})
