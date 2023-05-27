// import podataka
import { drina_info_bhs } from "../data/nacionalni_park/drina/drina.js";
import { sutjeska_info_bhs } from "../data/nacionalni_park/sutjeska/sutjeska.js";
import { una_info_bhs } from "../data/nacionalni_park/una/una.js";
import { kozara_info_bhs } from "../data/nacionalni_park/kozara/kozara.js";
import { bardaca_info_bhs } from "../data/barsko_podrucje/bardaca/bardaca.js";
import { balkana_info_bhs } from "../data/jezero/balkana/balkana.js";


/*
===================================================================================================
    Pomocne funkcije za popup
===================================================================================================
*/

function createGalleryPopup(data) {
    let popupContent = document.createElement("div");
    popupContent.innerHTML = document.getElementById(
        "map-gallery-popup-template"
    ).innerHTML;

    let galleryTitle = popupContent.querySelector(".map-gallery-title");
    let galleryLocation = popupContent.querySelector(".map-gallery-location");
    let galleryWebsite = popupContent.querySelector(".map-gallery-website");
    let galleryPhone = popupContent.querySelector(".map-gallery-phone");
    let galleryMail = popupContent.querySelector(".map-gallery-mail");
    let galleryMaps = popupContent.querySelector(".map-gallery-maps");
    let galleryDescription = popupContent.querySelector(
        ".map-gallery-description"
    );
    let galleryServices = popupContent.querySelector(".map-gallery-services");
    let galleryContainer = popupContent.querySelector(".map-gallery");

    galleryTitle.textContent = data.title;

    galleryLocation.textContent = data.location;

    if (data.website.length < 4) {
        galleryWebsite.classList.add("disabled");
    } else {
        galleryWebsite.textContent = data.website;
        galleryWebsite.href = data.website;
    }

    if (data.phone.length < 12) {
        galleryPhone.classList.add("disabled");
    } else {
        galleryPhone.textContent = data.phone;
        galleryPhone.href = "tel:" + data.phone;
    }

    if (data.mail.length < 4) {
        galleryMail.classList.add("disabled");
    } else {
        galleryMail.textContent = data.mail;
        galleryMail.href = "mailto:" + data.mail;
    }

    galleryMaps.href = data.mapsLink;

    galleryDescription.textContent = data.description;

    galleryServices.textContent = data.facilities_services;

    data.images.forEach(function (imageSrc) {
        let img = document.createElement("img");
        img.src = imageSrc;
        img.alt = data.title;
        img.addEventListener("click", function () {
            showFullSizeImage(imageSrc);
        });
        galleryContainer.appendChild(img);
    });

    return popupContent;
}


function showFullSizeImage(imageSrc) {
    // Create a modal or lightbox element
    let modal = document.createElement("div");
    modal.classList.add("modal");

    // Create an image element for the full-size image
    let fullSizeImg = document.createElement("img");
    fullSizeImg.src = imageSrc;
    fullSizeImg.alt = "Full-size Image";

    // Append the image to the modal
    modal.appendChild(fullSizeImg);

    // Add a close button
    let closeButton = document.createElement("span");
    closeButton.classList.add("close");
    closeButton.innerHTML = "&times;";
    modal.appendChild(closeButton);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Add a click event to the close button to exit from full-screen view
    closeButton.addEventListener("click", function () {
        modal.remove();
    });
}

/*
===================================================================================================
    Kreiranje mapa
=================================================================================================== 
*/
const API_KEY =
    "pk.eyJ1IjoidmxhZG9jb2RlcyIsImEiOiJjbDY3cnp5aHIwMHd0M2RwZXVycHVodnVjIn0.HZKE3gT9QVMr2fMmoVwK4w";
const mapboxURL = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${API_KEY}`;
const attribution =
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

let southWest = L.latLng(44.683911, 17.07723);
let northEast = L.latLng(44.867691, 17.393283);
let bounds = L.latLngBounds(southWest, northEast);

let map = L.map("map", {
    center: { lat: 44.2257001, lng: 17.6245741 },
    zoomControl: false,
    fullscreenControl: false,
    //maxBounds: bounds,
    zoom: 8,
    maxZoom: 19,
    minZoom: 5,
    //maxBoundsViscosity: 1.0,
});

let overlays = {};
let baselayers = {
    OpenStreetMap: L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
    ),
    "Svijetli režim 1": L.tileLayer(mapboxURL, {
        id: "mapbox/streets-v9",
        tileSize: 512,
        maxZoom: 17,
        zoomOffset: -1,
        attribution: attribution,
    }),

    "Svijetli režim 2": L.tileLayer(mapboxURL, {
        id: "mapbox/light-v10",
        tileSize: 512,
        maxZoom: 17,
        zoomOffset: -1,
        attribution: attribution,
    }),

    "Tamni režim": L.tileLayer(mapboxURL, {
        id: "mapbox/dark-v10",
        tileSize: 512,
        maxZoom: 17,
        zoomOffset: -1,
        attribution: attribution,
    }),
};
baselayers["OpenStreetMap"].addTo(map);

map.addControl(new L.Control.Fullscreen({ position: "bottomright" }));

L.control
    .zoom({
        position: "bottomright",
    })
    .addTo(map);

let layerControl = L.control
    .layers(baselayers, overlays, { position: "bottomright" })
    .addTo(map);



/*
===================================================================================================
    Dodavanje podataka na mapu
===================================================================================================
*/

// Nacionalni parkovi
let nacionalni_parkovi_group = L.layerGroup().addTo(map);
layerControl.addOverlay(nacionalni_parkovi_group, "Nacionalni parkovi");

const np_una_coord = [
    [44.7425, 15.9661],
    [44.3506, 16.2181],
    [44.384, 16.2224],
    [44.7128, 16.0639],
    [44.7318, 15.9033],
    [44.7294, 15.9033],
];
let np_una_polygon = L.polygon(np_una_coord, {
    color: "#008000",
    weight: 3,
    opacity: 0.65,
}).addTo(nacionalni_parkovi_group);
np_una_polygon.bindPopup(createGalleryPopup(una_info_bhs[0]));

const np_drina_coord = [44.0003, 19.35];
let np_drina_marker = L.marker(np_drina_coord).addTo(nacionalni_parkovi_group);
np_drina_marker.bindPopup(createGalleryPopup(drina_info_bhs[0]));
let np_drina_circle = L.circle(np_drina_coord, {
    color: "#008000",
    weight: 3,
    opacity: 0.65,
    radius: 5000,
}).addTo(nacionalni_parkovi_group);

fetch("data/nacionalni_park/kozara/kozara.geojson").then((response) => {
    response.json().then((data) => {
        let np_kozara = L.geoJSON(data, {
            style: {
                color: "#008000",
                weight: 3,
                opacity: 0.65,
            },
        });
        np_kozara.addTo(nacionalni_parkovi_group);
        np_kozara.bindPopup(createGalleryPopup(kozara_info_bhs[0]));
    });
});

fetch("data/nacionalni_park/sutjeska/sutjeska.geojson").then((response) => {
    response.json().then((data) => {
        let np_sutjeska = L.geoJSON(data, {
            style: {
                color: "#008000",
                weight: 3,
                opacity: 0.65,
            },
        });
        np_sutjeska.addTo(nacionalni_parkovi_group);
        np_sutjeska.bindPopup(createGalleryPopup(sutjeska_info_bhs[0]));
    });
});


// Barska područja/rezervati
let barska_podrucja = L.layerGroup().addTo(map);
layerControl.addOverlay(barska_podrucja, "Barska područja/rezervati");

fetch("data/barsko_podrucje/bardaca/bardaca.geojson").then((response) => {
    response.json().then((data) => {
        let pp_bardaca = L.geoJSON(data, {
            style: {
                color: "#008000",
                weight: 3,
                opacity: 0.65,
            },
        });
        pp_bardaca.addTo(barska_podrucja);
        pp_bardaca.bindPopup(createGalleryPopup(bardaca_info_bhs[0]));
    });
});


// Jezera
let jezera = L.layerGroup().addTo(map);
layerControl.addOverlay(jezera, "Jezera");

const jezero_balkana_coord = [44.4156366, 17.0491987];
let jezero_balkana_marker = L.marker(jezero_balkana_coord).addTo(jezera);
jezero_balkana_marker.bindPopup(createGalleryPopup(balkana_info_bhs[0]));
let jezero_balkana_circle = L.circle(jezero_balkana_coord, {
    color: "#008000",
    weight: 3,
    opacity: 0.65,
    radius: 500,
}).addTo(jezera);
