import Anthropic from "@anthropic-ai/sdk"
import type { EulogyRequest, EulogyResponse, DeadTech } from "@requiem/shared-types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function pickGravestoneStyle(cause: string): DeadTech["gravestone_style"] {
  const map: Record<string, DeadTech["gravestone_style"]> = {
    killed_by_google: "cracked",
    murdered_by_microsoft: "obsidian",
    died_of_neglect: "moss",
    acquired_and_buried: "marble",
    ran_out_of_funding: "cracked",
    deprecated: "moss",
    disrupted_to_death: "obsidian",
    replaced_by_better: "gilded",
  }
  return map[cause] ?? "marble"
}

export async function generateEulogy(req: EulogyRequest): Promise<EulogyResponse> {
  const age = req.died - req.born
  const prompt = `You are the officiant at a dramatic, darkly comedic funeral for a piece of technology.
Write a eulogy for: ${req.name}
Born: ${req.born} | Died: ${req.died} | Age: ${age} years
Cause of death: ${req.cause_of_death.replace(/_/g, " ")}
${req.context ? `Context: ${req.context}` : ""}

Respond ONLY with valid JSON:
{
  "eulogy": "3-4 sentence darkly funny eulogy referencing real facts.",
  "epitaph": "Single punchy gravestone line. Max 12 words.",
  "final_words": "What it would have said. 1 sentence, first person."
}`

  const msg = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  })
  const parsed = JSON.parse((msg.content[0] as { text: string }).text.trim())
  return { ...parsed, gravestone_style: pickGravestoneStyle(req.cause_of_death) }
}
