import Anthropic from "@anthropic-ai/sdk"
import type { CauseOfDeath } from "@requiem/shared-types"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const VALID: CauseOfDeath[] = [
  "killed_by_google","murdered_by_microsoft","died_of_neglect",
  "acquired_and_buried","disrupted_to_death","deprecated",
  "ran_out_of_funding","replaced_by_better",
]

export async function classifyCauseOfDeath(name: string, desc: string): Promise<CauseOfDeath> {
  const msg = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 32,
    messages: [{ role: "user", content: `Classify cause of death for "${name}": "${desc}"\nPick one: ${VALID.join(", ")}\nRespond with only the exact string.` }],
  })
  const result = (msg.content[0] as { text: string }).text.trim() as CauseOfDeath
  return VALID.includes(result) ? result : "deprecated"
}
