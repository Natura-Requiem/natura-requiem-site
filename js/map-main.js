// import podataka
// TODO: napisati funkciju koja ce automatski ucitavati sve podatke i kreirati markere na mapi
import { drina_info_bhs } from "../data/nacionalni_park/drina/drina.js";
import { sutjeska_info_bhs } from "../data/nacionalni_park/sutjeska/sutjeska.js";
import { una_info_bhs } from "../data/nacionalni_park/una/una.js";
import { kozara_info_bhs } from "../data/nacionalni_park/kozara/kozara.js";
import { bardaca_info_bhs } from "../data/ramsarska_podrucja/bardaca/bardaca.js";
import { balkana_info_bhs } from "../data/jezero/balkana/balkana.js";
import { blidinje_info_bhs } from "../data/jezero/blidinje/blidinje.js";
import { boracko_info_bhs } from "../data/jezero/boracko/boracko.js";
import { klinje_info_bhs } from "../data/jezero/klinje/klinje.js";
import { orlovacko_info_bhs } from "../data/jezero/orlovacko/orlovacko.js";
import { prokosko_info_bhs } from "../data/jezero/prokosko/prokosko.js";
import { janj_info_bhs } from "../data/strogi_rezervat/prasuma_janj/prasuma_janj.js";
import { lom_info_bhs } from "../data/strogi_rezervat/prasuma_lom/prasuma_lom.js";
import { pecka_info_bhs } from "../data/izletista/pecka/pecka.js";
import { orlovaca_info_bhs } from "../data/pecina/orlovaca/orlovaca.js";
import { vaganska_info_bhs } from "../data/pecina/vaganska/vaganska.js";
import { vjetrenica_info_bhs } from "../data/pecina/vjetrenica/vjetrenica.js";
import { hutovo_blato_info_bhs } from "../data/ramsarska_podrucja/hutovo_blato/hutovo_blato.js";
import { livanjsko_polje_info_bhs } from "../data/ramsarska_podrucja/livanjsko_polje/livanjsko_polje.js";
import { bliha_info_bhs } from "../data/vodopad/bliha/bliha.js";
import { kocusa_info_bhs } from "../data/vodopad/kocusa/kocusa.js";
import { kravica_info_bhs } from "../data/vodopad/kravica/kravica.js";
import { skakavac_info_bhs } from "../data/vodopad/skakavac/skakavac.js";
import { strbacki_buk_info_bhs } from "../data/vodopad/strbacki_buk/strbacki_buk.js";


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

map.on("fullscreenchange", function () {
    if (map.isFullscreen()) {
        console.log("entered fullscreen");
        // TODO: zatvoriti prikaz fotografija pri ulasku mape u fullscreen mod
    } else {
        console.log("exited fullscreen");
    }
});


/*
===================================================================================================
    Dodavanje podataka na mapu
===================================================================================================
*/
// Strogi rezervati
let strogi_rezervati_group = L.layerGroup().addTo(map);
layerControl.addOverlay(strogi_rezervati_group, "Strogi rezervati");
const prasuma_janj_lat = parseFloat(janj_info_bhs[0].latlong.split(",")[0]);
const prasuma_janj_lng = parseFloat(janj_info_bhs[0].latlong.split(",")[1]);
let prasuma_janj_marker = L.marker([prasuma_janj_lat, prasuma_janj_lng]).addTo(strogi_rezervati_group);
prasuma_janj_marker.bindPopup(createGalleryPopup(janj_info_bhs[0]));

const prasuma_lom_lat = parseFloat(lom_info_bhs[0].latlong.split(",")[0]);
const prasuma_lom_lng = parseFloat(lom_info_bhs[0].latlong.split(",")[1]);
let prasuma_lom_marker = L.marker([prasuma_lom_lat, prasuma_lom_lng]).addTo(strogi_rezervati_group);
prasuma_lom_marker.bindPopup(createGalleryPopup(lom_info_bhs[0]));



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



// Ramsarska podrucja
let barska_podrucja = L.layerGroup().addTo(map);
layerControl.addOverlay(barska_podrucja, "Ramsarska područja");

fetch("data/ramasarsko_podrucje/bardaca/bardaca.geojson").then((response) => {
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

const hutovo_blato_lat = parseFloat(hutovo_blato_info_bhs[0].latlong.split(",")[0]);
const hutovo_blato_lng = parseFloat(hutovo_blato_info_bhs[0].latlong.split(",")[1]);
let hutovo_blato_marker = L.marker([hutovo_blato_lat, hutovo_blato_lng]).addTo(barska_podrucja);
hutovo_blato_marker.bindPopup(createGalleryPopup(hutovo_blato_info_bhs[0]));

const livanjsko_polje_lat = parseFloat(livanjsko_polje_info_bhs[0].latlong.split(",")[0]);
const livanjsko_polje_lng = parseFloat(livanjsko_polje_info_bhs[0].latlong.split(",")[1]);
let livanjsko_polje_marker = L.marker([livanjsko_polje_lat, livanjsko_polje_lng]).addTo(barska_podrucja);
livanjsko_polje_marker.bindPopup(createGalleryPopup(livanjsko_polje_info_bhs[0]));


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

const blidinje_lat = parseFloat(blidinje_info_bhs[0].latlong.split(",")[0]);
const blidinje_lng = parseFloat(blidinje_info_bhs[0].latlong.split(",")[1]);
let jezero_blidinje_marker = L.marker([blidinje_lat, blidinje_lng]).addTo(jezera);
jezero_blidinje_marker.bindPopup(createGalleryPopup(blidinje_info_bhs[0]));

const boracko_lat = parseFloat(boracko_info_bhs[0].latlong.split(",")[0]);
const boracko_lng = parseFloat(boracko_info_bhs[0].latlong.split(",")[1]);
let jezero_boracko_marker = L.marker([boracko_lat, boracko_lng]).addTo(jezera);
jezero_boracko_marker.bindPopup(createGalleryPopup(boracko_info_bhs[0]));

const klinje_lat = parseFloat(klinje_info_bhs[0].latlong.split(",")[0]);
const klinje_lng = parseFloat(klinje_info_bhs[0].latlong.split(",")[1]);
let jezero_klinje_marker = L.marker([klinje_lat, klinje_lng]).addTo(jezera);
jezero_klinje_marker.bindPopup(createGalleryPopup(klinje_info_bhs[0]));

const orlovacko_lat = parseFloat(orlovacko_info_bhs[0].latlong.split(",")[0]);
const orlovacko_lng = parseFloat(orlovacko_info_bhs[0].latlong.split(",")[1]);
let jezero_orlovacko_marker = L.marker([orlovacko_lat, orlovacko_lng]).addTo(jezera);
jezero_orlovacko_marker.bindPopup(createGalleryPopup(orlovacko_info_bhs[0]));

const prokosko_lat = parseFloat(prokosko_info_bhs[0].latlong.split(",")[0]);
const prokosko_lng = parseFloat(prokosko_info_bhs[0].latlong.split(",")[1]);
let jezero_prokosko_marker = L.marker([prokosko_lat, prokosko_lng]).addTo(jezera);
jezero_prokosko_marker.bindPopup(createGalleryPopup(prokosko_info_bhs[0]));



// Izletišta
const pecka_lat = parseFloat(pecka_info_bhs[0].latlong.split(",")[0]);
const pecka_lng = parseFloat(pecka_info_bhs[0].latlong.split(",")[1]);
let izletiste_pecka_marker = L.marker([pecka_lat, pecka_lng]).addTo(map);
izletiste_pecka_marker.bindPopup(createGalleryPopup(pecka_info_bhs[0]));



// Pećine
let pecine = L.layerGroup().addTo(map);
layerControl.addOverlay(pecine, "Pećine");

const orlovaca_lat = parseFloat(orlovaca_info_bhs[0].latlong.split(",")[0]);
const orlovaca_lng = parseFloat(orlovaca_info_bhs[0].latlong.split(",")[1]);
let pecina_orlovaca_marker = L.marker([orlovaca_lat, orlovaca_lng]).addTo(pecine);
pecina_orlovaca_marker.bindPopup(createGalleryPopup(orlovaca_info_bhs[0]));

const vaganska_lat = parseFloat(vaganska_info_bhs[0].latlong.split(",")[0]);
const vaganska_lng = parseFloat(vaganska_info_bhs[0].latlong.split(",")[1]);
let pecina_vaganska_marker = L.marker([vaganska_lat, vaganska_lng]).addTo(pecine);
pecina_vaganska_marker.bindPopup(createGalleryPopup(vaganska_info_bhs[0]));

const vjetrenica_lat = parseFloat(vjetrenica_info_bhs[0].latlong.split(",")[0]);
const vjetrenica_lng = parseFloat(vjetrenica_info_bhs[0].latlong.split(",")[1]);
let pecina_vjetrenica_marker = L.marker([vjetrenica_lat, vjetrenica_lng]).addTo(pecine);
pecina_vjetrenica_marker.bindPopup(createGalleryPopup(vjetrenica_info_bhs[0]));



// Vodopadi
let vodopadi = L.layerGroup().addTo(map);
layerControl.addOverlay(vodopadi, "Vodopadi");

const bliha_lat = parseFloat(bliha_info_bhs[0].latlong.split(",")[0]);
const bliha_lng = parseFloat(bliha_info_bhs[0].latlong.split(",")[1]);
let vodopad_bliha_marker = L.marker([bliha_lat, bliha_lng]).addTo(vodopadi);
vodopad_bliha_marker.bindPopup(createGalleryPopup(bliha_info_bhs[0]));

const kocusa_lat = parseFloat(kocusa_info_bhs[0].latlong.split(",")[0]);
const kocusa_lng = parseFloat(kocusa_info_bhs[0].latlong.split(",")[1]);
let vodopad_kocusa_marker = L.marker([kocusa_lat, kocusa_lng]).addTo(vodopadi);
vodopad_kocusa_marker.bindPopup(createGalleryPopup(kocusa_info_bhs[0]));

const kravica_lat = parseFloat(kravica_info_bhs[0].latlong.split(",")[0]);
const kravica_lng = parseFloat(kravica_info_bhs[0].latlong.split(",")[1]);
let vodopad_kravica_marker = L.marker([kravica_lat, kravica_lng]).addTo(vodopadi);
vodopad_kravica_marker.bindPopup(createGalleryPopup(kravica_info_bhs[0]));

const skakavac_lat = parseFloat(skakavac_info_bhs[0].latlong.split(",")[0]);
const skakavac_lng = parseFloat(skakavac_info_bhs[0].latlong.split(",")[1]);
let vodopad_skakavac_marker = L.marker([skakavac_lat, skakavac_lng]).addTo(vodopadi);
vodopad_skakavac_marker.bindPopup(createGalleryPopup(skakavac_info_bhs[0]));

const strbacki_buk_lat = parseFloat(strbacki_buk_info_bhs[0].latlong.split(",")[0]);
const strbacki_buk_lng = parseFloat(strbacki_buk_info_bhs[0].latlong.split(",")[1]);
let vodopad_strbacki_buk_marker = L.marker([strbacki_buk_lat, strbacki_buk_lng]).addTo(vodopadi);
vodopad_strbacki_buk_marker.bindPopup(createGalleryPopup(strbacki_buk_info_bhs[0]));
