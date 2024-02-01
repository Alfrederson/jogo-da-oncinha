import * as THREE from "three"
import { gerarReels } from "./reels"

// não sei por que, mas o directionallight não funciona no android.
const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

// quantidade de rodas na coisa.
// se tiver mais do que 4, vai ter que mover a camera pra trás.
const NUM_REELS = 4
// quantidade de divisões.
const SLOT_SNAPS = 16
// quantos radianos tem de uma divisão pra outra
const SLOT_STEPS = (Math.PI*2)/SLOT_SNAPS

// boilerplate do three.js.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// mantem a proporção da camera.
window.addEventListener("resize", ()=>{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
})


const ambient = new THREE.AmbientLight(0xFFFFFF,isAndroid ? 1 : 0.4)
scene.add(ambient)

// não sei por que o directionallight não está funcionando no
// android, mas nenhum exemplo do THREE.js esta funcionando no
// meu no dia 1 de 2 de 2024
if(!isAndroid){
  const light = new THREE.DirectionalLight(0xFFFFFF,0.9)
  light.position.set(0,9,9)
  scene.add(light)  
}

// A gente gera a textura das bobinas assim!
// vira uma textura de 64 x 1024.
// não sei se o THREE.js é capaz de abstrair o limite
// de tamanho de textura do próprio celular.
const texture = new THREE.Texture(gerarReels(64,SLOT_SNAPS))
texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter
texture.needsUpdate= true
const reelGeometry = new THREE.CylinderGeometry(1, 1, 0.4, SLOT_SNAPS, 1, true);
const reelMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  map: texture,
});

// meshes dos rolos/coisas girantes
const spacing = 0.41
const reels = Array.from({length:NUM_REELS}, (_, i)=>{
  const cilindro = new THREE.Mesh(reelGeometry, reelMaterial)
  cilindro.rotation.set(0,0,Math.PI*0.5)
  const x = spacing * ( i - (NUM_REELS-1)/2)
  cilindro.position.set(x,0,0)
  scene.add(cilindro)
  return cilindro
})

// estado dos rolos
// sim, podia botar tudo dentro de uma "claaasssse" pra poder
// orientar aos objetos.
const speeds = Array.from({length:NUM_REELS}, x => 0)
const nearest = Array.from({length:NUM_REELS}, x => 0)
const stopped = Array.from({length:NUM_REELS}, x => false)
const angles = Array.from({length:NUM_REELS}, x => 0)

const animate = function () {
  requestAnimationFrame(animate);
  reels.forEach((reel,i) =>{
    speeds[i] -= speeds[i]*0.02
    angles[i] += speeds[i]
    while(angles[i] > 2*Math.PI){
      angles[i] -= 2*Math.PI
    }
    if(!stopped[i]){
      // a máquina de slots de verdade usa um freio
      // pra parar os discos. stopped[i]=true significa
      // "freiar esse disco"
      if(Math.abs(speeds[i]) <= 0.05 ){
        stopped[i] = true
        nearest[i] = Math.round(angles[i]/SLOT_STEPS)*SLOT_STEPS
      }  
    }else{
      // isso faz os rolos como se tivesse um mecanismo
      // de mola. não é necessário e você pode só fazer
      // speeds[i] = 0
      // angles[i] = nearest[i]
      speeds[i] += (nearest[i]-angles[i])*0.7
      speeds[i] *= 0.8
    }
    // -SLOT_STEPS/2 serve pra ter uma fileira alinhada
    // no meio da tela.
    reel.rotation.x = angles[i] - SLOT_STEPS/2
  })
  renderer.render(scene, camera);
};

animate();
function girar(){
  for(let i = 0; i < NUM_REELS; i++){
    setTimeout(()=>{
      stopped[i] = false
      speeds[i] = 1+Math.random()*2
    },100*i+ Math.random()*150)
  }
}
document.onkeydown = girar
document.onclick = girar
document.ontouchstart = girar