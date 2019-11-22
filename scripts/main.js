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


    function updatePosition(object, data_6d, objectId) {
        // Extracting the 6D co-rd from the data blob
        let object_data = data_6d['components']['6dEuler']['rigidBodies'][objectId];
        ({x, y, z, euler1, euler2, euler3 } = object_data);
        object.setAttribute('position', `${y/50} ${z/50} ${x/50}`);
        object.setAttribute('rotation', `${euler2} ${euler3} ${euler1}`);
    }

    const socket = io('http://192.168.1.100:80')
    // const socket = io('http://127.0.0.1:8080')

    // const mocap = true;
    const mocap = true;



    const firstAvatar = document.getElementById('anAvatar');
    socket.on('frame', (data) => {
        let obj1 = document.getElementById('object1');
        let obj2 = document.getElementById('object2');
        // console.log("socket data recieved",data);
        if(mocap)
        {
            updatePosition(obj1, data, 0);
            updatePosition(obj2, data, 1);

            // updatePosition(firstAvatar, data, 45);
        }
        else
        {
            ({x, y, z, euler1, euler2, euler3 } = data);
            // obj1.setAttribute('position', `${x} ${y} ${z}`);
            // obj2.setAttribute('rotation', `${euler1} ${euler2} ${euler3}`);
        }

    })

    document.querySelector('#second-user').addEventListener('click', function() {
        console.log("2nd Clicked")
        document.querySelector('#second-user').setAttribute('visible', 'false')
        document.querySelector('#first-user').setAttribute('visible', 'false')
        document.getElementById('cam1').remove()
        var cam2 = document.createElement("a-camera");
        cam2.setAttribute('id', 'cam2');
        let parent = document.getElementById('object2');
        parent.appendChild(cam2);


    });


    document.querySelector('#first-user').addEventListener('click', function() {
        console.log("1st Clicked")
        document.querySelector('#second-user').setAttribute('visible', 'false')
        document.querySelector('#first-user').setAttribute('visible', 'false')

    });
});
