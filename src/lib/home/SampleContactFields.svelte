<script lang="ts">
  import { resolve } from '$app/paths';
  import { countryNames } from './sample-countries';

  let {
    roastery = $bindable(),
    name = $bindable(),
    email = $bindable(),
    phone = $bindable(),
    street = $bindable(),
    postalCode = $bindable(),
    city = $bindable(),
    country = $bindable(),
    message = $bindable()
  }: {
    roastery: string;
    name: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    message: string;
  } = $props();
</script>

<label class="field">
  <span>Roastery *</span>
  <input name="roastery" type="text" required bind:value={roastery} autocomplete="organization" />
</label>
<label class="field">
  <span>Name *</span>
  <input name="name" type="text" required bind:value={name} autocomplete="name" />
</label>
<label class="field">
  <span>Email *</span>
  <input name="email" type="email" required bind:value={email} autocomplete="email" />
</label>
<label class="field">
  <span>Phone</span>
  <input name="phone" type="tel" bind:value={phone} autocomplete="tel" />
</label>
<label class="field">
  <span>Street *</span>
  <input
    name="street"
    type="text"
    required
    bind:value={street}
    autocomplete="shipping street-address"
  />
</label>
<div class="split">
  <label class="field">
    <span>Postal code *</span>
    <input
      name="postalCode"
      type="text"
      required
      bind:value={postalCode}
      autocomplete="shipping postal-code"
    />
  </label>
  <label class="field">
    <span>City *</span>
    <input
      name="city"
      type="text"
      required
      bind:value={city}
      autocomplete="shipping address-level2"
    />
  </label>
</div>
<label class="field">
  <span>Country *</span>
  <select name="country" required bind:value={country} autocomplete="shipping country-name">
    <option value="">Choose a country</option>
    {#each countryNames as countryName (countryName)}
      <option value={countryName}>{countryName}</option>
    {/each}
  </select>
</label>
<label class="field">
  <span>Message</span>
  <textarea name="message" rows="4" bind:value={message}></textarea>
</label>
<label class="consent">
  <input type="checkbox" name="privacy" required />
  <span>
    I have read the <a href={resolve('/privacy')} target="_blank" rel="noreferrer">privacy policy</a
    >
    and agree that you can use these details to send me the sample.
  </span>
</label>

<style>
  .split {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 16px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 14px;
  }

  .field span {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    border: 0;
    border-bottom: 1px solid rgba(17, 17, 17, 0.28);
    border-radius: 0;
    background: transparent;
    color: var(--makeda-ink);
    font-family: inherit;
    font-size: 1rem;
    line-height: inherit;
  }

  .field input,
  .field select {
    height: 40px;
  }

  .field textarea {
    min-height: 72px;
    padding-top: 8px;
    resize: vertical;
  }

  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    outline: none;
    border-bottom-color: var(--makeda-coffee);
  }

  .consent {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin: 0 0 16px;
    font-size: 14px;
    line-height: 1.5;
  }

  .consent input {
    margin-top: 4px;
    accent-color: var(--makeda-coffee);
  }

  .consent a {
    color: var(--makeda-coffee);
    font-weight: 600;
  }

  @media (max-width: 639px) {
    .split {
      grid-template-columns: 1fr;
    }
  }
</style>
