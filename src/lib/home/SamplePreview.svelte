<script lang="ts">
  let {
    coffees,
    amount,
    name,
    roastery,
    email,
    phone,
    street,
    postalCode,
    city,
    country,
    message,
    onChangeCoffees,
    onChangeAddress
  }: {
    coffees: { origin: string; crop: string }[];
    amount: string;
    name: string;
    roastery: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    message: string;
    onChangeCoffees: () => void;
    onChangeAddress: () => void;
  } = $props();
</script>

<div class="preview">
  <section>
    <div class="row">
      <h4>Samples</h4>
      <button type="button" class="text-button" onclick={onChangeCoffees}>Change coffees</button>
    </div>
    <ul>
      {#each coffees as coffee (`${coffee.origin}-${coffee.crop}`)}
        <li>{coffee.origin} · {coffee.crop}</li>
      {/each}
    </ul>
    <p class="amount">{amount}</p>
  </section>

  <section>
    <div class="row">
      <h4>Send to</h4>
      <button type="button" class="text-button" onclick={onChangeAddress}>Change address</button>
    </div>
    <p class="lines">
      {name}<br />
      {roastery}<br />
      {email}<br />
      {#if phone.trim()}{phone.trim()}<br />{/if}
      {street}<br />
      {postalCode}
      {city}<br />
      {country}
    </p>
  </section>

  {#if message.trim()}
    <section>
      <h4>Message</h4>
      <p class="lines message">{message.trim()}</p>
    </section>
  {/if}
</div>

<style>
  section + section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(17, 17, 17, 0.28);
  }

  .row {
    display: flex;
    gap: 16px;
    align-items: baseline;
    justify-content: space-between;
  }

  h4 {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  ul {
    margin: 10px 0 0;
    padding: 0;
    list-style: none;
  }

  li + li {
    margin-top: 4px;
  }

  .amount,
  .lines {
    margin: 10px 0 0;
  }

  .message {
    white-space: pre-wrap;
  }

  .text-button {
    padding: 0;
    border: 0;
    background: none;
    color: var(--makeda-ink);
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .text-button:hover {
    color: var(--makeda-coffee);
  }
</style>
