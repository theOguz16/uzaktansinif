<scipt setup>
</scipt>
<template>
  <Datepicker>
    <template #dp-input="{ value }">
      <label class="theme-label block">Bitiş Tarihi</label>
      <input
        placeholder="Bitiş Tarihi"
        class="theme-input w-full"
        type="text"
        :value="value"
      />
    </template>
  </Datepicker>
</template>
