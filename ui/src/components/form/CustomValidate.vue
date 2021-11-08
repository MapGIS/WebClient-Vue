<template>
  <mapgis-ui-form>
    <mapgis-ui-form-item
      :validate-status="validateStatus"
      :help="help"
    >
      <slot></slot>
    </mapgis-ui-form-item>
  </mapgis-ui-form>
</template>

<script>
export default {
  name: 'mapgis-ui-form-custom-validate',
  props: {
    validateStatus: {
      type: String,
      default: '',
      validator: v => ['', 'success', 'warning', 'error', 'validating'].includes(v)
    },
    help: {
      type: String,
      default: '',
    }
  },
  computed: {
  }
}
</script>
