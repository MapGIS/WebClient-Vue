<template>
  <div @click="$_click" :style="containerStyle" class="mapgis-ui-svg-icon-container" @mouseenter="$_iconEnter(type)"
       @mouseleave="$_iconLeave">
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'delete'"
         :class="{mapgisIconHover : hoverIcon === 'delete'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
        <path d="M9 8h2v9H9zM13 8h2v9h-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'marker'"
         :class="{mapgisIconHover : hoverIcon === 'marker'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path fill-rule="nonzero"
              d="M21.5 20l.3.4-1.4 1.4-5.8-5.8h-1.8v6h-1.6v-6H6v-2l2-2V9.4l-6-6 1.3-1.3 18 18h.2zM7 2.3V2h10v2h-1v7.2l-9-9z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'noMarker'"
         :class="{mapgisIconHover : hoverIcon === 'noMarker'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'edit'"
         :class="{mapgisIconHover : hoverIcon === 'edit'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M20.41 4.94l-1.35-1.35a2 2 0 0 0-2.83 0L13.4 6.41 3 16.82V21h4.18l10.46-10.46 2.77-2.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'noEye'"
         :class="{mapgisIconHover : hoverIcon === 'noEye'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M10.6 7.3L12 8.8c1.4 0 2.5 1.2 2.6 2.5l1.5 1.6c.2-.4.3-.9.3-1.4a4.5 4.5 0 0 0-6-4.3z"></path>
        <path
            d="M12 6c3.8 0 7.2 2.1 8.8 5.5a9.8 9.8 0 0 1-2.6 3.3l1.4 1.4c1.5-1.2 2.7-2.8 3.4-4.7A11.8 11.8 0 0 0 8 4.7l1.6 1.6L12 6zM16.4 16l-1.2-1.3-1.3-1.3-3.8-3.8-1.3-1.3-1.2-1.2L6 5.6 3.3 2.8 2 4.2l2.5 2.5A12 12 0 0 0 1 11.6a11.8 11.8 0 0 0 15 6.8l4.3 4.3 1.4-1.4-3.8-3.8-1.5-1.5zM12 14.1a2.7 2.7 0 0 1-2.6-2.5l2.6 2.5zM12 17a9.8 9.8 0 0 1-8.8-5.5 9.8 9.8 0 0 1 2.6-3.3l2 1.9c-.2.4-.3.9-.3 1.4a4.5 4.5 0 0 0 6 4.3l.9.9-2.4.3z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'eye'"
         :class="{mapgisIconHover : hoverIcon === 'eye'}"
         class="mapgisIconHover mapgis-ui-svg-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet"
         focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M12 7a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z"></path>
        <path
            d="M12 4C7 4 2.7 7.1 1 11.5a11.8 11.8 0 0 0 22 0C21.3 7.1 17 4 12 4zm0 13a9.8 9.8 0 0 1-8.8-5.5C4.8 8.1 8.2 6 12 6s7.2 2.1 8.8 5.5A9.8 9.8 0 0 1 12 17z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'more'"
         :class="{mapgisIconHover : hoverIcon === 'more'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'back'"
         :class="{mapgisIconHover : hoverIcon === 'back'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g mirror-in-rtl="" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'close'"
         :class="{mapgisIconHover : hoverIcon === 'close'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g width="24" height="24">
        <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'point'"
         :class="{mapgisIconHover : hoverIcon === 'point'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path fill-rule="nonzero"
              d="M12 2a8 8 0 0 1 8 8.2c0 3.3-2.7 7.3-8 11.8-5.3-4.5-8-8.5-8-11.8A8 8 0 0 1 12 2zm6 8.2A6 6 0 0 0 12 4a6 6 0 0 0-6 6.2c0 2.3 2 5.4 6 9.1 4-3.7 6-6.8 6-9.1zM12 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'polyline'"
         :class="{mapgisIconHover : hoverIcon === 'polyline'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path fill-rule="nonzero"
              d="M4.3 10.7l2 2a3 3 0 0 1 1.4-1.4l-2-2a3 3 0 0 1-1.4 1.4zm7.4 2l1-1a3 3 0 0 1-1.4-1.4l-1 1a3 3 0 0 1 1.4 1.4zm3.6-1l3 3a3 3 0 0 1 1.4-1.4l-3-3a3 3 0 0 1-1.4 1.4zM21 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-7-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-5 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-6-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'polygon'"
         :class="{mapgisIconHover : hoverIcon === 'polygon'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h16zm0 14V6H4v12h16zM6 8h12v8H6V8z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'image'"
         :class="{mapgisIconHover : hoverIcon === 'image'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M20 10h-2V7h-3V5h3V2h2v3h3v2h-3v3zm-4 3a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm4-1v7H4V7h9V3H9L7.17 5H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-7h-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'fontSize'"
         :class="{mapgisIconHover : hoverIcon === 'fontSize'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <g fill-rule="evenodd">
          <path fill-rule="nonzero" d="M6 4v3h5v13h3V7h5V4H6zm-6 8h3v8h3v-8h3V9H0v3z"></path>
          <path d="M16 11l4 4 4-4z"></path>
        </g>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'fontWeight'"
         :class="{mapgisIconHover : hoverIcon === 'fontWeight'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M16.11 11.76C17.22 10.99 18 9.74 18 8.57 18 5.99 16 4 13.43 4H6v16h8.33c2.39 0 4.24-1.94 4.24-4.33 0-1.74-.98-3.22-2.46-3.91zM9 6.5h4c1.11 0 2 .89 2 2s-.89 2-2 2H9v-4zm4.67 11H9v-4h4.67c1.11 0 2 .89 2 2s-.9 2-2 2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'italic'"
         class="mapgis-ui-svg-icon"
         t="1638186849222" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="1082">
      <path d="M603.54 276.12l-97.07 533.93H422.2l97.07-533.93h84.27z" fill="#333333" p-id="1083"></path>
      <path
          d="M709.99 346.99H387.06l13.88-76.36h322.93l-13.88 76.36zM625.68 810.69H302.75l13.88-76.35h322.93l-13.88 76.35z"
          fill="#333333" p-id="1084"></path>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'link'"
         :class="{mapgisIconHover : hoverIcon === 'link'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'textAlign'"
         :class="{mapgisIconHover : hoverIcon === 'textAlign'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M6 5a4 4 0 1 0 0 8h1v7h2V7h2v13h2V7h2V5H6z"></path>
        <path d="M15 11l4 4 4-4z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'removeStyle'"
         :class="{mapgisIconHover : hoverIcon === 'removeStyle'}"
         class="mapgis-ui-svg-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M12.75 12.75l-2.1-2.1-7.84-7.84-1.42 1.41 8.41 8.41L6.64 20h3l2.26-5.27 7.88 7.88 1.41-1.42zM12.22 7l-.72 1.67 2.1 2.1L15.21 7H21V4H6.83l3 3z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'border'"
         class="mapgis-ui-svg-icon"
         t="1638186754154" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="931">
      <path
          d="M291.58 249.48h261.37c48.21 0 86.87 12.13 116 36.38 29.12 24.26 43.69 60.91 43.69 109.97 0 29.77-6.66 55.27-19.96 76.48-13.31 21.23-32.27 37.62-56.87 49.2v1.65c33.14 7.73 58.25 24.95 75.32 51.68 17.07 26.74 25.61 60.23 25.61 100.46 0 23.15-3.77 44.79-11.3 64.91-7.53 20.13-19.34 37.49-35.4 52.09-16.08 14.61-36.66 26.19-61.76 34.73-25.12 8.55-54.99 12.82-89.63 12.82H291.58V249.48z m94.15 247.22h153.66c22.6 0 41.43-7.03 56.49-21.08 15.06-14.06 22.6-34.31 22.6-60.77 0-29.77-6.78-50.71-20.34-62.84-13.56-12.12-33.14-18.19-58.75-18.19H385.73V496.7z m0 258.8h166.46c28.62 0 50.84-8.13 66.66-24.39 15.82-16.25 23.73-39.27 23.73-69.04 0-29.21-7.91-51.68-23.73-67.39s-38.04-23.56-66.66-23.56H385.73V755.5z"
          fill="#333333" p-id="932"></path>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'picture'"
         class="mapgis-ui-svg-icon"
         t="1638186145095" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="3037">
      <path
          d="M0 64l1024-0.128V960H0V64z m74.56 74.688v746.624H948.48V138.688H74.56z m623.36 271.552a85.12 85.12 0 1 1-0.064-170.368 85.12 85.12 0 0 1 0.128 170.368z m-305.28 179.392l62.72-73.664 152.32 166.72 119.232-89.536L948.48 832v53.312h-82.048l-151.04-163.392-119.744 89.856-203.008-222.144z m0 0l-251.904 295.744H74.56V816l252.8-297.792 65.28 71.424zM323.904 522.112l66.048-77.568 68.032 74.24-2.752-2.816-62.72 73.6 0.256 0.32-0.128 0.192-0.256-0.256 0.128-0.192-65.28-71.424-3.328 3.904z"
          fill="#262626" p-id="3038"></path>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'strike'"
         class="mapgis-ui-svg-icon"
         t="1638187019192" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="1380">
      <path d="M275.88 270.6v90.29h188.98v191.27h104.53V360.89H759.2V270.6zM464.86 635.99h104.52V856.3H464.86z"
            fill="#333333" p-id="1381"></path>
      <path d="M276.48 577.18h483.05v34H276.48z" fill="#333333" p-id="1382"></path>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'underline'"
         class="mapgis-ui-svg-icon"
         t="1638187178632" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="1530">
      <path
          d="M306.89 243.98h87.75V536c0 16.85 0.81 33.94 2.46 51.24 1.63 17.32 6.32 32.88 14.04 46.68 7.72 13.81 19.41 25.16 35.1 34.04 15.67 8.9 37.79 13.34 66.34 13.34 28.54 0 50.65-4.44 66.34-13.34 15.67-8.88 27.38-20.24 35.1-34.04 7.72-13.8 12.39-29.36 14.04-46.68 1.63-17.31 2.46-34.4 2.46-51.24V243.98h87.75v320.8c0 32.29-4.91 60.37-14.74 84.24-9.83 23.87-23.76 43.87-41.77 60.02-18.02 16.15-39.66 28.2-64.93 36.15-25.27 7.95-53.35 11.93-84.24 11.93-30.89 0-58.96-3.98-84.24-11.93-25.27-7.95-46.92-20.01-64.93-36.15-18.02-16.15-31.94-36.15-41.77-60.02-9.83-23.87-14.74-51.95-14.74-84.24v-320.8zM274.88 798.68h470.15v47.35H274.88z"
          fill="#333333" p-id="1531"></path>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'ul'"
         class="mapgis-ui-svg-icon"
         t="1638187355917" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="1681">
      <path
          d="M390.12 257.01h410.22V357.2H390.12zM390.12 475.61h410.22V575.8H390.12zM390.12 694.21h410.22V794.4H390.12z"
          fill="#333333" p-id="1682"></path>
      <path d="M277.82 307.62m-50.09 0a50.09 50.09 0 1 0 100.18 0 50.09 50.09 0 1 0-100.18 0Z" fill="#333333"
            p-id="1683"></path>
      <path d="M277.82 525.71m-50.09 0a50.09 50.09 0 1 0 100.18 0 50.09 50.09 0 1 0-100.18 0Z" fill="#333333"
            p-id="1684"></path>
      <path d="M277.82 738.94m-50.09 0a50.09 50.09 0 1 0 100.18 0 50.09 50.09 0 1 0-100.18 0Z" fill="#333333"
            p-id="1685"></path>
    </svg>
    <svg :style="iconStyle" :width="width" :height="height" v-if="type === 'ol'"
         class="mapgis-ui-svg-icon"
         t="1638187473021" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
         p-id="1833">
      <path
          d="M235.54 255.8c5.7 0 11.25-0.48 16.64-1.43 5.39-0.95 10.26-2.53 14.62-4.75 4.36-2.22 8.08-5.07 11.17-8.56 3.09-3.48 5.11-7.76 6.06-12.84h22.11v166.39h-29.71V277.19h-40.88V255.8zM345.84 624.84H232.22c0.16-13.79 3.48-25.83 9.98-36.13 6.5-10.3 15.37-19.25 26.62-26.86 5.39-3.96 11.01-7.8 16.88-11.53 5.86-3.72 11.25-7.72 16.16-12s8.95-8.91 12.12-13.9 4.83-10.73 4.99-17.23c0-3.01-0.36-6.22-1.07-9.63-0.71-3.41-2.1-6.57-4.16-9.51-2.06-2.93-4.91-5.39-8.56-7.37-3.65-1.98-8.4-2.97-14.26-2.97-5.39 0-9.86 1.07-13.43 3.21-3.56 2.14-6.42 5.07-8.56 8.8-2.14 3.72-3.73 8.12-4.75 13.19-1.03 5.07-1.63 10.54-1.78 16.4h-27.1c0-9.19 1.23-17.71 3.68-25.55s6.14-14.62 11.05-20.32c4.91-5.71 10.89-10.18 17.95-13.43 7.05-3.25 15.25-4.87 24.6-4.87 10.14 0 18.62 1.66 25.43 4.99 6.81 3.33 12.32 7.53 16.52 12.6 4.2 5.07 7.17 10.58 8.91 16.52 1.74 5.94 2.61 11.61 2.61 16.99 0 6.66-1.03 12.68-3.09 18.07a58.412 58.412 0 0 1-8.32 14.86 84.278 84.278 0 0 1-11.88 12.48c-4.44 3.8-9.03 7.37-13.79 10.7-4.75 3.33-9.51 6.5-14.26 9.51s-9.15 6.02-13.19 9.03c-4.04 3.01-7.57 6.14-10.58 9.39-3.01 3.25-5.07 6.7-6.18 10.34h81.05v24.22zM277.14 748.61c4.43 0.16 8.87-0.16 13.31-0.95 4.44-0.79 8.4-2.18 11.89-4.16 3.48-1.98 6.3-4.71 8.44-8.2 2.14-3.48 3.21-7.76 3.21-12.84 0-7.13-2.42-12.84-7.25-17.11-4.84-4.28-11.05-6.42-18.66-6.42-4.75 0-8.88 0.95-12.36 2.85-3.49 1.9-6.38 4.48-8.68 7.72-2.3 3.25-4 6.89-5.11 10.93-1.11 4.04-1.59 8.2-1.43 12.48h-27.1c0.32-8.08 1.82-15.57 4.52-22.46 2.69-6.89 6.38-12.87 11.05-17.95 4.67-5.07 10.34-9.03 16.99-11.88 6.66-2.85 14.18-4.28 22.58-4.28 6.5 0 12.87 0.95 19.13 2.85 6.26 1.9 11.88 4.68 16.88 8.32 4.99 3.65 8.99 8.28 12 13.9 3.01 5.63 4.52 12.09 4.52 19.37 0 8.4-1.9 15.73-5.71 21.99-3.8 6.26-9.75 10.82-17.83 13.67v0.48c9.51 1.9 16.91 6.62 22.23 14.14 5.31 7.53 7.96 16.68 7.96 27.45 0 7.93-1.59 15.02-4.75 21.27-3.17 6.26-7.45 11.57-12.84 15.93-5.39 4.36-11.65 7.73-18.78 10.1s-14.66 3.57-22.58 3.57c-9.67 0-18.11-1.39-25.31-4.16-7.21-2.77-13.23-6.69-18.07-11.77-4.84-5.07-8.52-11.17-11.05-18.3-2.54-7.13-3.88-15.05-4.04-23.77h27.1c-0.32 10.14 2.18 18.58 7.49 25.31 5.31 6.74 13.27 10.1 23.89 10.1 9.03 0 16.6-2.57 22.7-7.73 6.1-5.15 9.15-12.48 9.15-21.99 0-6.5-1.27-11.65-3.8-15.45-2.54-3.8-5.86-6.69-9.98-8.68-4.12-1.98-8.76-3.21-13.91-3.68-5.15-0.48-10.42-0.63-15.81-0.48v-20.17zM393.55 260.89h410.22v100.19H393.55zM393.55 500.89h410.22v100.19H393.55zM393.55 719.49h410.22v100.19H393.55z"
          fill="#333333" p-id="1834"></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-svg-icon",
  props: {
    type: {
      type: String
    },
    iconStyle: {
      type: Object
    },
    containerStyle: {
      type: Object
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
  },
  data() {
    return {
      hoverIcon: undefined
    }
  },
  methods: {
    $_click() {
      this.$emit("click");
    },
    $_iconLeave() {
      this.hoverIcon = undefined;
    },
    $_iconEnter(icon) {
      this.hoverIcon = icon;
    },
  }
}
</script>

<style scoped>
.mapgisIconHover {
  opacity: 1 !important;
}

.mapgis-ui-svg-icon {
  pointer-events: none;
  color: white;
  opacity: 1;
  fill: currentColor;
  display: inline-block;
  width: 24px;
  height: 24px;
}

.mapgis-ui-svg-icon-container {
  width: 40px;
  height: 40px;
  line-height: 52px;
  display: inline-block;
  cursor: pointer;
}
</style>