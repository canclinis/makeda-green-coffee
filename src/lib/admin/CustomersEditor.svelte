<script lang="ts">
  import { untrack } from 'svelte';
  import { enhance, type SubmitFunction } from '$app/forms';
  import { transientFlag } from '#lib/design/transient.svelte.ts';
  import Text from '#lib/design/Text.svelte';
  import type { CustomerRecord } from '#lib/home/customer-log.ts';
  import CustomerRow from './CustomerRow.svelte';
  import FormMessage from './FormMessage.svelte';

  let {
    customers
  }: {
    customers: CustomerRecord[];
  } = $props();

  let draft = $state(untrack(() => customers.map((customer) => ({ ...customer }))));
  let loadedIds = $state(untrack(() => customers.map((customer) => customer.id)));
  let source = untrack(() => customers);

  $effect(() => {
    const next = customers;
    if (next === source) return;
    source = next;
    draft = next.map((customer) => ({ ...customer }));
    loadedIds = next.map((customer) => customer.id);
    // What the server just sent is, by definition, what it has saved.
    confirmed = JSON.stringify(draft);
  });

  // A new customer is saved once it has a name, because the server needs one.
  const payload = $derived(
    draft.filter((customer) => loadedIds.includes(customer.id) || customer.name.trim() !== '')
  );
  const payloadJson = $derived(JSON.stringify(payload));
  // The last list the server confirmed. A save is only sent when the list differs from it.
  let confirmed = untrack(() => payloadJson);

  function addCustomer() {
    draft.push({
      id: crypto.randomUUID(),
      name: '',
      roastery: '',
      email: '',
      phone: '',
      street: '',
      postalCode: '',
      city: '',
      country: ''
    });
  }

  // Set when an admin removes a customer the server already has. The removal goes out with the next save.
  let removing = '';

  function removeCustomer(id: string) {
    if (!loadedIds.includes(id)) {
      draft = draft.filter((customer) => customer.id !== id);
      return;
    }
    removing = id;
    requestSave();
  }

  const FALLBACK_ERROR =
    'The customers could not be saved. Your last change is still here; try again.';
  let error = $state('');
  const errorOnly = $derived(error ? { message: error } : null);

  let formElement: HTMLFormElement | undefined = $state();
  let saving = $state(false);
  let again = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const saved = transientFlag();

  /** Waits for a pause in typing before saving. */
  function saveSoon() {
    clearTimeout(timer);
    timer = setTimeout(requestSave, 500);
  }

  /** Saves now, unless the list is already saved. If a save is running, one more follows it. */
  function requestSave() {
    clearTimeout(timer);
    if (saving) {
      again = true;
      return;
    }
    if (removing === '' && payloadJson === confirmed) return;
    formElement?.requestSubmit();
  }

  const save: SubmitFunction = ({ formData }) => {
    const omitted = removing;
    removing = '';
    const sent = payload.filter((customer) => customer.id !== omitted);
    const sentJson = JSON.stringify(sent);
    saving = true;
    formData.set('customers', sentJson);
    formData.set('loaded', JSON.stringify(loadedIds));
    return async ({ result, update }) => {
      try {
        // The form is the live editor, so a reset would blank the fields the admin keeps working in.
        await update({ reset: false, invalidateAll: false });
        if (result.type !== 'success') {
          error =
            result.type === 'failure' && typeof result.data?.message === 'string'
              ? result.data.message
              : FALLBACK_ERROR;
          return;
        }
        error = '';
        confirmed = sentJson;
        loadedIds = [...new Set([...loadedIds, ...sent.map((customer) => customer.id)])];
        if (omitted) {
          draft = draft.filter((customer) => customer.id !== omitted);
          loadedIds = loadedIds.filter((id) => id !== omitted);
        }
        saved.flash();
      } finally {
        saving = false;
        if (again) {
          again = false;
          requestSave();
        }
      }
    };
  };
</script>

<Text style="margin-bottom: 24px">
  Contact details live here once. Samples and orders point to a customer, so a change here shows up
  everywhere. Changes save automatically.
</Text>

<form
  bind:this={formElement}
  method="POST"
  action="?/save"
  use:enhance={save}
  oninput={saveSoon}
  onchange={requestSave}
  autocomplete="off"
  novalidate
>
  {#if draft.length === 0}
    <Text>No customers yet.</Text>
  {:else}
    {#each draft as customer, index (customer.id)}
      <CustomerRow
        bind:customer={draft[index]}
        {index}
        isNew={!loadedIds.includes(customer.id)}
        onremove={() => removeCustomer(customer.id)}
      />
    {/each}
  {/if}
  <p class="actions">
    <button type="button" class="add" onclick={addCustomer}>Add customer</button>
    <span role="status" aria-live="polite">
      {saving ? 'Saving…' : saved.active ? 'All changes saved' : ''}
    </span>
  </p>
  <FormMessage form={errorOnly} />
</form>

<style>
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin: 24px 0 16px;
  }

  .add {
    min-height: 44px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--makeda-coffee);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-decoration: underline;
    text-transform: uppercase;
    cursor: pointer;
  }
</style>
