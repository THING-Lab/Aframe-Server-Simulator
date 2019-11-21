define(function (require) {
    var scene = document.querySelector('a-scene');
    var box = document.createElement('a-box');
    box.setAttribute('color', 'yellow');
    box.setAttribute('height', '12.5');
    box.setAttribute('width', '15');
    box.setAttribute('depth', '1.75');
    box.setAttribute('position', '0 0 -12.5');
    box.setAttribute('src', '#netTexture');
    scene.appendChild(box);


    let correction = new Quaternion();

    function updatePosition(object, data_6d, objectId) {
        // Extracting the 6D co-rd from the data blob
        let object_data = data_6d['components']['6dEuler']['rigidBodies'][objectId];
        ({x, y, z, euler1, euler2, euler3 } = object_data);
        object.setAttribute('position', `${y/50} ${z/50} ${x/50}`);
        object.setAttribute('rotation', `${euler2} ${euler3} ${euler1}`);
    }

    const socket = io('http://192.168.1.100:80')
    // const socket = io('http://127.0,0,1:8080')

    const mocap = true;
    const cameraParent = document.getElementById('cameraParent');
    const cameraProxy = document.getElementById('cameraProxy');

    socket.on('frame', (data) => {
        console.log("socket data recieved",data);
        if(mocap)
        {

            let proxy_rotation = cameraProxy.getAttribute('rotation');
            let main_rotation = cameraParent.getAttribute('rotation');
            let lerpSpeed = 0.02;
            let correction = new Quaternion();
            correction = proxy_rotation* new Quaternion().inverse(main_rotation);
            updatePosition(cameraProxy, data, 0);
        }
        else
        {
            ({x, y, z, euler1, euler2, euler3 } = data);
            camera.setAttribute('position', `${x} ${y} ${z}`);
            camera.setAttribute('rotation', `${euler1} ${euler2} ${euler3}`);
        }

    })
});
