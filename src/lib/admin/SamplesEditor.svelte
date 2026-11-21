<script lang="ts">
  import { untrack } from 'svelte';
  import Text from '#lib/design/Text.svelte';
  import { transientFlag } from '#lib/design/transient.svelte.ts';
  import type { CustomerRecord } from '#lib/home/customer-log.ts';
  import type { SampleRecord } from '#lib/home/sample-log.ts';
  import FormMessage from './FormMessage.svelte';
  import SampleRequestRow from './SampleRequestRow.svelte';

  let {
    samples,
    customers,
    owners
  }: {
    samples: SampleRecord[];
    customers: CustomerRecord[];
    owners: string[];
  } = $props();

  let draft = $state(untrack(() => samples.map((sample) => ({ ...sample }))));
  let loadedIds = $state(untrack(() => samples.map((sample) => sample.id)));
  let source = untrack(() => samples);

  // Rows the page has loaded, plus hand-added rows once they have a customer, coffees, and an amount.
  function isComplete(sample: SampleRecord): boolean {
    return sample.customerId !== '' && sample.coffees.trim() !== '' && sample.amount.trim() !== '';
  }

  const payload = $derived(
    draft.filter((sample) => loadedIds.includes(sample.id) || isComplete(sample))
  );
  const payloadJson = $derived(JSON.stringify(payload));

  // The last list the server confirmed. Edits are saved whenever the payload differs from it.
  let lastSaved = untrack(() => payloadJson);

  $effect(() => {
    const next = samples;
    if (next === source) return;
    source = next;
    draft = next.map((sample) => ({ ...sample }));
    loadedIds = next.map((sample) => sample.id);
    lastSaved = JSON.stringify(draft);
  });

  const counts = $derived({
    ordered: draft.filter((sample) => sample.status === 'ordered').length,
    sent: draft.filter((sample) => sample.status === 'sent').length,
    received: draft.filter((sample) => sample.status === 'received').length
  });

  function addSample() {
    draft.unshift({
      id: crypto.randomUUID(),
      customerId: '',
      status: 'ordered',
      comment: '',
      owner: '',
      coffees: '',
      amount: '',
      message: '',
      requestedAt: new Date().toISOString()
    });
  }

  let removeError = $state('');

  // Saves and removals go to the server one at a time, in the order they were asked for. A save
  // that was already running can then never finish after a removal and bring the row back.
  let chain: Promise<unknown> = Promise.resolve();
  let pending = $state(0);
  const saving = $derived(pending > 0);

  function enqueue(task: () => Promise<void>): Promise<void> {
    pending += 1;
    const run = chain.then(task).finally(() => (pending -= 1));
    chain = run.catch(() => {});
    return run;
  }

  async function post(action: string, body: FormData): Promise<boolean> {
    const result = await fetch(action, {
      method: 'POST',
      headers: { Accept: 'application/json', 'x-sveltekit-action': 'true' },
      body
    })
      .then((response) => response.json())
      .catch(() => null);
    return result?.type === 'success';
  }

  function removeSample(id: string): Promise<void> | void {
    if (!loadedIds.includes(id)) {
      draft = draft.filter((sample) => sample.id !== id);
      return;
    }

    return enqueue(async () => {
      removeError = '';
      const body = new FormData();
      body.set('id', id);
      if (!(await post('?/remove', body))) {
        removeError = 'The sample could not be removed. Please try again.';
        return;
      }
      draft = draft.filter((sample) => sample.id !== id);
      loadedIds = loadedIds.filter((loadedId) => loadedId !== id);
      // The server has dropped this row, so the confirmed list is now the same minus that row.
      lastSaved = JSON.stringify(
        (JSON.parse(lastSaved) as SampleRecord[]).filter((sample) => sample.id !== id)
      );
    });
  }

  let saveError = $state('');
  let timer: ReturnType<typeof setTimeout> | undefined;
  const saved = transientFlag();

  function persist(): Promise<void> {
    return enqueue(async () => {
      // Read when it is this save's turn, so it sends everything typed while it waited.
      const json = payloadJson;
      if (json === lastSaved) return;

      const sentIds = payload.map((sample) => sample.id);
      const body = new FormData();
      body.set('samples', json);
      body.set('loaded', JSON.stringify(loadedIds));

      saveError = '';
      if (!(await post('?/save', body))) {
        saveError = 'The samples could not be saved. Your last change is still here; try again.';
        return;
      }
      lastSaved = json;
      loadedIds = [...new Set([...loadedIds, ...sentIds])];
      saved.flash();
    });
  }

  $effect(() => {
    if (payloadJson === lastSaved) return;
    clearTimeout(timer);
    timer = setTimeout(() => void persist(), 500);
    return () => clearTimeout(timer);
  });

  const errorMessage = $derived(removeError || saveError);
</script>

<Text style="margin-bottom: 8px">
  Each card is a sample request from the site, or one you add by hand. Assign an owner, mark it sent
  when you post it, and received when it arrives. Changes save automatically.
</Text>
<p class="counts">Ordered {counts.ordered} · Sent {counts.sent} · Received {counts.received}</p>

<div class="editor">
  {#if draft.length === 0}
    <Text>No sample requests yet.</Text>
  {:else}
    {#each draft as sample, index (sample.id)}
      <SampleRequestRow
        bind:sample={draft[index]}
        customer={customers.find((customer) => customer.id === sample.customerId)}
        {customers}
        {index}
        isNew={!loadedIds.includes(sample.id)}
        {owners}
        onremove={() => removeSample(sample.id)}
      />
    {/each}
  {/if}
  <p class="actions">
    <button type="button" class="add" onclick={addSample}>Add sample</button>
    <span role="status" aria-live="polite">
      {saving ? 'Saving…' : saved.active ? 'All changes saved' : ''}
    </span>
  </p>
  <FormMessage form={errorMessage ? { message: errorMessage } : null} />
</div>

<style>
  .counts {
    margin-bottom: 24px;
    color: rgba(0, 0, 0, 0.62);
  }

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
