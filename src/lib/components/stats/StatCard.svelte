<script lang="ts">
  export let title: string;
  export let value: string | number;
  export let subtitle = '';
  export let icon = '';
  export let color = 'primary';
</script>

<div class="stat bg-base-100 shadow rounded-box">
  <div class="stat-figure text-{color}">
    {#if icon}
      <span class="text-3xl">{icon}</span>
    {/if}
  </div>
  <div class="stat-title">{title}</div>
  <div class="stat-value text-{color}">{value}</div>
  {#if subtitle}
    <div class="stat-desc">{subtitle}</div>
  {/if}
</div>
