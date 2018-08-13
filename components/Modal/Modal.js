export default {
  name: 'modal',

  mounted() {

  },

  props: {
    header: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      visible: false,
    };
  },

  methods: {
    hide(e) {
      if (!e || e.target === this.$el) {
        this.visible = false;
        this.$emit('hidden');
      }
    },

    show() {
      if (this.visible !== true) {
        this.visible = true;
        this.$emit('visible');
      }
    },
  },

  computed: {

  },
};
