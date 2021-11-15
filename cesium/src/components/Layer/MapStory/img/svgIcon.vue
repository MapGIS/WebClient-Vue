<template>
  <div @click="$_click" :style="containerStyle" class="mapgis-mapstory-icon-container" @mouseenter="$_iconEnter(type)"
       @mouseleave="$_iconLeave">
    <svg :style="iconStyle" v-if="type === 'delete'" :class="{mapgisIconHover : hoverIcon === 'delete'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
        <path d="M9 8h2v9H9zM13 8h2v9h-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'marker'" :class="{mapgisIconHover : hoverIcon === 'marker'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path fill-rule="nonzero"
              d="M21.5 20l.3.4-1.4 1.4-5.8-5.8h-1.8v6h-1.6v-6H6v-2l2-2V9.4l-6-6 1.3-1.3 18 18h.2zM7 2.3V2h10v2h-1v7.2l-9-9z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'noMarker'" :class="{mapgisIconHover : hoverIcon === 'noMarker'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'edit'" :class="{mapgisIconHover : hoverIcon === 'edit'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M20.41 4.94l-1.35-1.35a2 2 0 0 0-2.83 0L13.4 6.41 3 16.82V21h4.18l10.46-10.46 2.77-2.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'noEye'" :class="{mapgisIconHover : hoverIcon === 'noEye'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24"
         preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M10.6 7.3L12 8.8c1.4 0 2.5 1.2 2.6 2.5l1.5 1.6c.2-.4.3-.9.3-1.4a4.5 4.5 0 0 0-6-4.3z"></path>
        <path
            d="M12 6c3.8 0 7.2 2.1 8.8 5.5a9.8 9.8 0 0 1-2.6 3.3l1.4 1.4c1.5-1.2 2.7-2.8 3.4-4.7A11.8 11.8 0 0 0 8 4.7l1.6 1.6L12 6zM16.4 16l-1.2-1.3-1.3-1.3-3.8-3.8-1.3-1.3-1.2-1.2L6 5.6 3.3 2.8 2 4.2l2.5 2.5A12 12 0 0 0 1 11.6a11.8 11.8 0 0 0 15 6.8l4.3 4.3 1.4-1.4-3.8-3.8-1.5-1.5zM12 14.1a2.7 2.7 0 0 1-2.6-2.5l2.6 2.5zM12 17a9.8 9.8 0 0 1-8.8-5.5 9.8 9.8 0 0 1 2.6-3.3l2 1.9c-.2.4-.3.9-.3 1.4a4.5 4.5 0 0 0 6 4.3l.9.9-2.4.3z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'eye'" :class="{mapgisIconHover : hoverIcon === 'eye'}"
         class="mapgisIconHover mapgis-mapstory-icon"
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
    <svg :style="iconStyle" v-if="type === 'more'" :class="{mapgisIconHover : hoverIcon === 'more'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'back'" :class="{mapgisIconHover : hoverIcon === 'back'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g mirror-in-rtl="" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'close'" :class="{mapgisIconHover : hoverIcon === 'close'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g width="24" height="24">
        <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'point'" :class="{mapgisIconHover : hoverIcon === 'point'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path fill-rule="nonzero"
              d="M12 2a8 8 0 0 1 8 8.2c0 3.3-2.7 7.3-8 11.8-5.3-4.5-8-8.5-8-11.8A8 8 0 0 1 12 2zm6 8.2A6 6 0 0 0 12 4a6 6 0 0 0-6 6.2c0 2.3 2 5.4 6 9.1 4-3.7 6-6.8 6-9.1zM12 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'polyline'" :class="{mapgisIconHover : hoverIcon === 'polyline'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path fill-rule="nonzero"
              d="M4.3 10.7l2 2a3 3 0 0 1 1.4-1.4l-2-2a3 3 0 0 1-1.4 1.4zm7.4 2l1-1a3 3 0 0 1-1.4-1.4l-1 1a3 3 0 0 1 1.4 1.4zm3.6-1l3 3a3 3 0 0 1 1.4-1.4l-3-3a3 3 0 0 1-1.4 1.4zM21 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-7-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-5 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-6-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'polygon'" :class="{mapgisIconHover : hoverIcon === 'polygon'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h16zm0 14V6H4v12h16zM6 8h12v8H6V8z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'image'" :class="{mapgisIconHover : hoverIcon === 'image'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M20 10h-2V7h-3V5h3V2h2v3h3v2h-3v3zm-4 3a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm4-1v7H4V7h9V3H9L7.17 5H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-7h-2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'fontSize'" :class="{mapgisIconHover : hoverIcon === 'fontSize'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <g fill-rule="evenodd">
          <path fill-rule="nonzero" d="M6 4v3h5v13h3V7h5V4H6zm-6 8h3v8h3v-8h3V9H0v3z"></path>
          <path d="M16 11l4 4 4-4z"></path>
        </g>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'fontWeight'" :class="{mapgisIconHover : hoverIcon === 'fontWeight'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M16.11 11.76C17.22 10.99 18 9.74 18 8.57 18 5.99 16 4 13.43 4H6v16h8.33c2.39 0 4.24-1.94 4.24-4.33 0-1.74-.98-3.22-2.46-3.91zM9 6.5h4c1.11 0 2 .89 2 2s-.89 2-2 2H9v-4zm4.67 11H9v-4h4.67c1.11 0 2 .89 2 2s-.9 2-2 2z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'italic'" :class="{mapgisIconHover : hoverIcon === 'italic'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M9 4v3h3.5l-4 10H5v3h10v-3h-3.5l4-10H19V4H9z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'link'" :class="{mapgisIconHover : hoverIcon === 'link'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'textAlign'" :class="{mapgisIconHover : hoverIcon === 'textAlign'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path d="M6 5a4 4 0 1 0 0 8h1v7h2V7h2v13h2V7h2V5H6z"></path>
        <path d="M15 11l4 4 4-4z"></path>
      </g>
    </svg>
    <svg :style="iconStyle" v-if="type === 'removeStyle'" :class="{mapgisIconHover : hoverIcon === 'removeStyle'}"
         class="mapgis-mapstory-icon"
         viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g viewBox="0 0 24 24">
        <path
            d="M12.75 12.75l-2.1-2.1-7.84-7.84-1.42 1.41 8.41 8.41L6.64 20h3l2.26-5.27 7.88 7.88 1.41-1.42zM12.22 7l-.72 1.67 2.1 2.1L15.21 7H21V4H6.83l3 3z"></path>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "svg-icon",
  props: {
    type: {
      type: String
    },
    iconStyle: {
      type: Object
    },
    containerStyle: {
      type: Object
    }
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

.mapgis-mapstory-icon {
  pointer-events: none;
  color: white;
  opacity: 0.5;
  fill: currentColor;
  display: inline-block;
  width: 24px;
  height: 24px;
}

.mapgis-mapstory-icon-container {
  width: 36px;
  height: 64px;
  line-height: 76px;
  display: inline-block;
  cursor: pointer;
}
</style>