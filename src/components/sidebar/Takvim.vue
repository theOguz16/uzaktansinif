<script>
import Datepicker from "vuejs3-datepicker";

export default {
  // ...
  components: {
    Datepicker,
  },
  // ...
};
</script>
<template>
  <!-- kapsayıcı içine alıp rengini öyle değiştir -->

  <div class="takvim">
    <datepicker :inline="true"></datepicker>
  </div>
</template>
