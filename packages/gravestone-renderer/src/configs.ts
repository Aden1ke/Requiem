import type { DeadTech } from "@requiem/shared-types"
export const GRAVESTONE_CONFIGS: Record<DeadTech["gravestone_style"], { color: number; emissive: number; roughness: number; metalness: number }> = {
  marble:   { color: 0xe8e8e8, emissive: 0x111111, roughness: 0.2, metalness: 0.1 },
  obsidian: { color: 0x1a1a2e, emissive: 0x0f0f23, roughness: 0.1, metalness: 0.8 },
  moss:     { color: 0x3d5a3e, emissive: 0x1a2e1a, roughness: 0.9, metalness: 0.0 },
  cracked:  { color: 0x8b8b8b, emissive: 0x2a2a2a, roughness: 0.8, metalness: 0.1 },
  gilded:   { color: 0xd4af37, emissive: 0x3d2e00, roughness: 0.3, metalness: 0.9 },
}
