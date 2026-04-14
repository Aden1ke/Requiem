import { Router } from "express"
import { z } from "zod"
import { validate } from "../middleware/validate"
import { supabase } from "../lib/supabase"
export const tributeRouter = Router()
tributeRouter.post("/", validate(z.object({
  tech_id: z.string().uuid(),
  type: z.enum(["flower","candle","commit_message","prayer"]),
  message: z.string().max(280).nullable().optional(),
})), async (req, res) => {
  const { data, error } = await supabase.from("tributes").insert(req.body).select().single()
  if (error) return res.status(500).json({ error: error.message })
  await supabase.rpc("increment_tribute_count",{tech_id:req.body.tech_id})
  return res.status(201).json(data)
})
