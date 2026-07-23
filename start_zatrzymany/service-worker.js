// ======================================
// START ZATRZYMANY v1.0
// SERVICE WORKER
// ======================================


const CACHE_NAME =
"start-zatrzymany-trener-v1.0";



const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./manifest.json"

];





// Instalacja

self.addEventListener(
"install",
event => {


    event.waitUntil(

        caches.open(
            CACHE_NAME
        )

        .then(cache => {


            return cache.addAll(
                FILES_TO_CACHE
            );


        })

    );


    self.skipWaiting();


});








// Aktywacja

self.addEventListener(
"activate",
event => {


    event.waitUntil(

        caches.keys()

        .then(keys => {


            return Promise.all(

                keys.map(key => {


                    if(
                        key !== CACHE_NAME
                    ){

                        return caches.delete(
                            key
                        );

                    }


                })

            );


        })

    );


    self.clients.claim();


});









// Obsługa żądań

self.addEventListener(
"fetch",
event => {


    event.respondWith(

        caches.match(
            event.request
        )

        .then(response => {


            return response ||

            fetch(
                event.request
            );


        })

    );


});