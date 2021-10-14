// // inputSearch.addEventListener("change", function (e) {
// //   const input = e.target.value;
// //   getIp(input);
// });

// const API_KEY='d4fc4c453c0c4636817e2a15a9a1a642'

// // fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.IP_TRACKER_API_KEY}")
// //   .then((data) => data.json())
// //   .then((data) => console.log(data));
// fetch(`http://ipwhois.app/json/`).then((data) => console.log(data));

// async function failedIp(ip) {
//   const ipAddress = await fetch(`http://ipwhois.app/json/${ip}`);
//   const response = await ipAddress.json();
//   displayMarker(response.latitude, response.longitude);
// }

// function  getIp();
// displayMarker(37.4223,-122.085)

class IpAddress {
  #mymap;
  constructor() {
    this.inputUser = document.querySelector("#user-input");
    document.querySelector(".submit").addEventListener("click", this.userInput.bind(this));
  }
  userInput(e){
    e.preventDefault();
    let val = this.inputUser.value.replace(" ", "");
    setTimeout(() => {
      this.getIp(val);
    }, 0);
    this.inputUser.value = "";
  }
  async getIp(ip) {
    const url = ip ?
      `https://json.geoiplookup.io/${ip}` :
      `https://json.geoiplookup.io/`;
    //   const url = ip ? `http://ipwhois.app/json/${ip}` : `http://ipwhois.app/json/`;
    try {
      const loc = await fetch(url);
      const response = await loc.json();
      if (!response.success) throw new Error("enter a valid IP address");

      // displaying data after getting response from API

      this.displayUserInfo(response);
      this.displayMap(response.latitude, response.longitude);
    } catch (err) {
      document.querySelector(".load").display='none'
      alert(err.message);
      this.inputUser.value = "";
    }
  }
  displayUserInfo(response) {
    const {
      ip,
      city,
      region,
      postal_code,
      timezone_name,
      isp
    } = response;
    document.querySelector("#ip_info").innerHTML = "";
    const html = `  <section class="ip_info__display row">
       <article class="ip_info ip_address col-lg-3 col-md-3 col-sm-3 container">
          <label for="ip_address" class="ip_info--label">IP ADDRESS</label>
           <h3>${ip}</h3>
        </article>
        </article>
       <article class="ip_info ip_lcoation  col-lg-3 col-md-3 col-sm-3 container">
          <label for="ip_lcoation"  class="ip_info--label">LOCATION</label>
          <h3>${city},${region} ${postal_code}</h3>
        </article>
       <article class="ip_info ip_timezone  col-lg-3 col-md-3 col-sm-3 container">
          <label for="ip_time-zone"  class="ip_info--label">TIMEZONE</label>
          <h3>${timezone_name}</h3>
        </article>
       <article class="ip_info isp  col-lg-3 col-md-3 col-sm-3 container">
          <label for="isp"  class="ip_info--label">ISP</label>
          <h3>${isp}</h3>
        </article>
    </section> `;
    document.querySelector("#ip_info").insertAdjacentHTML("beforeend", html);
  }
  customMarkerIcon(lat, lng) {
    const iconOptions = {
      iconUrl: "./images/placeholder.png",
      iconSize: [50, 50],
    };
    // Creating a custom icon
    const customIcon = L.icon(iconOptions);

    // Creating Marker Options
    const markerOptions = {
      clickable: "true",
      draggable: "true",
      icon: customIcon,
    };
    let marker = L.marker([lat, lng], markerOptions).addTo(this.#mymap);
  }
  displayMap(lat, lng) {
    if (this.#mymap != undefined) this.#mymap.remove();
    this.#mymap = L.map("mapid", {
      dragging: false,
      center: [lat, lng],
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([lat, lng], 11);
    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.#mymap);
    // marker to be displayed on map
    this.customMarkerIcon(lat, lng);
  }
}
const userIp = new IpAddress();
userIp.getIp()