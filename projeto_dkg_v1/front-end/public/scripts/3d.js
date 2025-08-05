import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

    let scene, camera, renderer, starGeo,star,moveStars = false, start_btn = document.getElementById("start-session-btn");
   

    const vertices = [], velocities  = [], accelerations  = [];
    const colors = [];
    function init(click = false){
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight,1,1000);
        camera.position.setZ(1);
        camera.rotation.x = Math.PI/2;

        renderer = new THREE.WebGLRenderer();
        console.log(window.innerHeight)
        //renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(window.innerWidth, 500);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x060126);

        document.body.appendChild(renderer.domElement);
        
        starGeo = new THREE.BufferGeometry();
     
        for(let i = 0; i< 4000; i++){

               const x = Math.random() * 600 -300;
               const y = Math.random() * 600 -300;
               const z =  Math.random() * 600 - 300;
               vertices.push(x, y, z);
               velocities.push(0);
               accelerations.push(0.02);
               const isWhite = Math.random() < 0.7; // 70% de chance de ser branca
               if (isWhite) {
                   colors.push(1, 1, 1); // Cor branca
               } else {
                   // Cor aleatória para as estrelas restantes
                   const r = Math.random();
                   const g = Math.random();
                   const b = Math.random();
                   colors.push(r, g, b);
               }
               
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        starGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        let sprite = new THREE.TextureLoader().load('./assets/images/star.png')
        let starMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size:3.1,
            map:sprite,
            transparent:true,
            vertexColors: true
        })
        start_btn.addEventListener("click",()=>{
            let div = document.getElementById("main-content")
            div.classList.add("desaparecer")
            moveStars = true;
            setTimeout(()=>{
                window.location.href = "/search";
            },2000);
        });
        star = new THREE.Points(starGeo,starMaterial);
        window.addEventListener("mousedown", ()=>{

            moveStars = true;
        })
        window.addEventListener("mouseup", ()=>{
            moveStars = false;
        })
        scene.add(star);
        window.addEventListener('resize', onWindowResize);
        animate();
    }
    function onWindowResize() {
        // Atualiza as proporções da câmera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        // Ajusta o tamanho do renderizador
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
   
     window.addEventListener('resize', onWindowResize);
    function animate(){
        const positions = starGeo.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            velocities[i / 3] += accelerations[i / 3]; // Aceleração constante

            if (moveStars) {
                // Após o clique: aceleração afeta o movimento
                positions[i + 1] -= velocities[i / 3];
            } else {
                // Antes do clique: movimento mais lento
                positions[i + 1] -= velocities[i / 3] * 0.1; // Reduzimos a velocidade antes do clique
            }
    
            // Reposiciona estrelas que saem da tela
            if (positions[i + 1] < -200) {
                positions[i + 1] = 200;
                velocities[i / 3] = 0; // Reinicia a velocidade
            }
        }
        starGeo.attributes.position.needsUpdate = true;
        renderer.render(scene,camera);
        
        requestAnimationFrame(animate);
    }
  
    init()
    
    



