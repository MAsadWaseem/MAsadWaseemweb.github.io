'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "e5e5b82a900baf60f642772744b6c9cd",
"assets/assets/3.json": "94514d976277eddd88b3586650f6a37b",
"assets/assets/android.jpg": "9d6fdd823a17175f8803e5552ecc608c",
"assets/assets/android_avatar.jpg": "a9f4f8dc21a87cb55cde49489ba11a45",
"assets/assets/book5.json": "661b2612fba3e0d1457ae1783963825f",
"assets/assets/boy_computer.json": "74190406a462e57e1b5e16e187aa2453",
"assets/assets/datascience.jpg": "cc22df56ec63dac7aab5ddb5b5b9f046",
"assets/assets/datascience_avatar.jpg": "66f42307ef565fa82e7bf7a7972b2b6c",
"assets/assets/dgtp.png": "d972104fa87398454b4b8d960721abb3",
"assets/assets/dgtp_avatar.jpg": "4794564c67659cda09b7140d1942f473",
"assets/assets/flutter.jpg": "9c93198864d4b0348749700871d1ad57",
"assets/assets/flutter_avatar.jpg": "f8583dd334d68386eeadf553a94977b4",
"assets/assets/headerlottie.json": "22a577e0132bfb2693ad96edb6f2613e",
"assets/assets/headertwolottie.json": "22a577e0132bfb2693ad96edb6f2613e",
"assets/assets/logoCas.png": "b61379664846bf0e518afeb465bd32ec",
"assets/assets/man_computer.json": "18f18ea0976cfaa707662c7c39f15c36",
"assets/assets/ml.jpg": "f5451df992545ba8cce00703af0336f0",
"assets/assets/ml_avatar.jpg": "bc815b6182c3255488777107e518c5d3",
"assets/assets/nxtcovercomp.jpg": "bbc3c03369236301a8eb65d6c6342efb",
"assets/assets/pen.gif": "22e1a63e2c281851b8bd9ce789579f2d",
"assets/assets/pencompress.gif": "805348f4760818c4ef3e130cceae9007",
"assets/assets/python.jpg": "84f3bb10e1fa7208f2581fa093a087a2",
"assets/assets/python_avatar.jpg": "bae4a4f33941cd992e2448df49eb7bf4",
"assets/assets/thinking_boy.json": "b6a331a54f98cd1745bd6a91a2541a48",
"assets/assets/unity.jpg": "870374a82b6c35eac1d3201711c021aa",
"assets/assets/unity_avatar.jpg": "d360026a84e9b6608321ef51c3467670",
"assets/assets/webdevpic.jpg": "2051dc8442979cb0574f49d27c6dabca",
"assets/assets/webdevpic_avatar.jpg": "6e205d21f8ad929042719caf859338a7",
"assets/assets/workingheader.json": "b0aa297475597fbffd9e5503b25142ed",
"assets/FontManifest.json": "18eda8e36dfa64f14878d07846d6e17f",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/NOTICES": "353255a6893f93f897ac308851587d5c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "5a37ae808cf9f652198acde612b5328d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "2bca5ec802e40d3f4b60343e346cedde",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "2aa350bd2aeab88b601a593f793734c0",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "86f9ab1321cec4674c50d85c80902682",
"/": "86f9ab1321cec4674c50d85c80902682",
"main.dart.js": "88df06336e52ded6c0f1fc43cc5d0c83",
"manifest.json": "1164832ba249dd75adb5e563c3e07c11"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
