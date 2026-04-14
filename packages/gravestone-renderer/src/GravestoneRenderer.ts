import * as THREE from "three"
import type { DeadTech } from "@requiem/shared-types"
import { GRAVESTONE_CONFIGS } from "./configs"

export class GravestoneRenderer {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private gravestone: THREE.Group | null = null
  private particles: THREE.Points | null = null
  private animationId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0f)
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.08)
    this.camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 100)
    this.camera.position.set(0, 1.5, 4)
    this.camera.lookAt(0, 1, 0)
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.setupLighting()
    this.setupGround()
    this.setupParticles()
  }

  private setupLighting() {
    this.scene.add(new THREE.AmbientLight(0x111133, 0.5))
    const moon = new THREE.DirectionalLight(0x4466ff, 0.8)
    moon.position.set(-5, 10, 5)
    moon.castShadow = true
    this.scene.add(moon)
    const rim = new THREE.PointLight(0x220033, 1.5, 8)
    rim.position.set(2, 2, -2)
    this.scene.add(rim)
  }

  private setupGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 32, 32),
      new THREE.MeshLambertMaterial({ color: 0x0d1a0d })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)
  }

  private setupParticles() {
    const count = 800
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = Math.random() * 5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    this.particles = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x334466, size: 0.04 }))
    this.scene.add(this.particles)
  }

  public renderTech(tech: Partial<DeadTech>) {
    if (this.gravestone) this.scene.remove(this.gravestone)
    const config = GRAVESTONE_CONFIGS[tech.gravestone_style ?? "marble"]
    this.gravestone = this.buildGravestone(config)
    this.gravestone.position.y = -2
    this.scene.add(this.gravestone)
    this.riseAnimation()
  }

  private buildGravestone(config: typeof GRAVESTONE_CONFIGS[keyof typeof GRAVESTONE_CONFIGS]): THREE.Group {
    const group = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial(config)
    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.2), mat)
    slab.position.y = 0.9
    slab.castShadow = true
    group.add(slab)
    const arch = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16, 1, false, 0, Math.PI), mat)
    arch.rotation.z = Math.PI / 2
    arch.position.y = 1.8
    group.add(arch)
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.35), mat)
    base.position.y = 0.075
    group.add(base)
    const glow = new THREE.PointLight(0xff6600, 0.6, 2)
    glow.position.set(0, 0.3, 0.5)
    group.add(glow)
    return group
  }

  private riseAnimation() {
    if (!this.gravestone) return
    const start = performance.now()
    const rise = (now: number) => {
      const t = Math.min((now - start) / 1200, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      if (this.gravestone) this.gravestone.position.y = -2 + 2 * eased
      if (t < 1) requestAnimationFrame(rise)
    }
    requestAnimationFrame(rise)
  }

  public start() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      if (this.particles) this.particles.rotation.y += 0.0003
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  public stop() { if (this.animationId !== null) cancelAnimationFrame(this.animationId) }

  public resize(w: number, h: number) {
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }
}
