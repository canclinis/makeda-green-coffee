<script lang="ts">
  let {
    form,
    saved = 'Saved.'
  }: {
    form?: { saved?: boolean; message?: string } | null;
    saved?: string;
  } = $props();
</script>

{#if form?.saved}
  <p role="status" class="saved">{saved}</p>
{/if}
{#if form?.message}
  <p role="alert" class="error">{form.message}</p>
{/if}

<style>
  p {
    margin: 0 0 16px;
    padding: 12px 16px;
    border-left: 4px solid;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.04);
    font-size: 16px;
    font-weight: 700;
  }

  .saved {
    border-color: var(--makeda-black);
  }

  .error {
    border-color: var(--makeda-coffee);
    color: var(--makeda-coffee);
  }
</style>
