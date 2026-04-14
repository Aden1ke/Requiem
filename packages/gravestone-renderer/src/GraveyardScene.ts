import * as THREE from "three"
import type { DeadTech } from "@requiem/shared-types"
import { GRAVESTONE_CONFIGS } from "./configs"

export class GraveyardScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private animationId: number | null = null
  private clock = new THREE.Clock()

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x080810)
    this.scene.fog = new THREE.FogExp2(0x080810, 0.05)
    this.camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 0.1, 200)
    this.camera.position.set(0, 3, 12)
    this.camera.lookAt(0, 0, 0)
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.scene.add(new THREE.AmbientLight(0x111133, 0.4))
    const moon = new THREE.DirectionalLight(0x3355ff, 0.6)
    moon.position.set(-10, 20, 10)
    this.scene.add(moon)
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshLambertMaterial({ color: 0x0a120a }))
    ground.rotation.x = -Math.PI / 2
    this.scene.add(ground)
  }

  public populateGraveyard(techs: DeadTech[]) {
    techs.forEach((tech, i) => {
      const group = new THREE.Group()
      const mat = new THREE.MeshStandardMaterial(GRAVESTONE_CONFIGS[tech.gravestone_style])
      const slab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.12), mat)
      slab.position.y = 0.5
      group.add(slab)
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.2), mat)
      base.position.y = 0.05
      group.add(base)
      const glow = new THREE.PointLight(0x4400ff, 0.3, 1.5)
      glow.position.set(0, 0.5, 0.3)
      group.add(glow)
      group.position.set((i % 5 - 2) * 2.5, 0, -Math.floor(i / 5) * 3)
      this.scene.add(group)
    })
  }

  public start() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate)
      const t = this.clock.getElapsedTime()
      this.camera.position.x = Math.sin(t * 0.05) * 2
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }

  public stop() { if (this.animationId !== null) cancelAnimationFrame(this.animationId) }
}
