<script context="module" lang="ts">
  const currentDate = new Date();

  const months: string[] = [];
  for (let i = 1; i <= 12; i++) {
    // select options only accepts string values
    months.push(i.toString());
  }

  const currentYear = currentDate.getFullYear();
  const years: string[] = [];
  for (let i = currentYear; i <= currentYear + 20; i++) {
    // select options only accepts string values
    years.push(i.toString());
  }
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Button, { Icon, Label } from "@smui/button";
  import Tooltip, { Wrapper, Title, Content } from "@smui/tooltip";
  import { NAME_REGEX, CC_REGEX } from "$lib/util/regex";
  import Select, { Option } from "@smui/select";

  let cardholderName = "";
  let cardNumber = "";
  let expirationMonth = "";
  let expirationYear = "";
  let cvv = "";

  // Check if selected expiry date has already passed
  let invalidMonth = false;
  let invalidYear = false;
  function checkExpiryDate(): void {
    let month = expirationMonth;
    let year = expirationYear;

    // check if year or month inputs are empty
    invalidYear = year == null;
    invalidMonth = month == null;

    if (!month || !year) {
      return;
    }

    const monthIndex = parseInt(month) - 1;
    const fullYear = parseInt(year);

    const date = new Date();
    date.setMonth(monthIndex);
    date.setFullYear(fullYear);

    const invalidDate = date.getTime() < Date.now();

    invalidMonth = invalidYear = invalidDate;
  }

  // prevent whitespace input from being entered
  function filterInput(value: string) {
    return value.replace(/(\s)/g, "");
  }

  let form: HTMLFormElement;

  async function submitHandler() {
    // validate expiration date
    // SMUI Select components do not natively validate
    if (invalidMonth || !expirationMonth || !expirationYear) {
      invalidMonth = true;
      invalidYear = true;
      form.reportValidity();
      return;
    }

    goto("/checkout/review");
  }
</script>

<form bind:this={form} on:submit|preventDefault={submitHandler}>
  <div class="input-group">
    <Textfield
      bind:value={cardholderName}
      variant="filled"
      type="text"
      input$pattern={NAME_REGEX}
      input$autocomplete="cc-name"
      label="Cardholder name"
      required
    >
      <HelperText validationMsg slot="helper">
        Please enter the name on the card.
      </HelperText>
    </Textfield>
  </div>

  <div class="input-group">
    <Textfield
      bind:value={cardNumber}
      on:input={() => (cardNumber = filterInput(cardNumber))}
      variant="filled"
      type="tel"
      input$pattern={CC_REGEX.number}
      input$autocomplete="cc-number"
      input$minLength="12"
      input$maxLength="19"
      label="Card number"
      required
    >
      <Icon class="material-icons" slot="leadingIcon">payment</Icon>
      <HelperText validationMsg slot="helper">
        Please enter your card number (12 digits or more).
      </HelperText>
    </Textfield>
  </div>

  <Label class="expiration-label">Expiration date</Label>
  <div class="expiration-date">
    <div class="input-group month">
      <Select
        bind:value={expirationMonth}
        on:click={checkExpiryDate}
        variant="filled"
        label="Month"
        required
        invalid={invalidMonth}
      >
        {#each months as month}
          <Option value={month}>{month}</Option>
        {/each}
      </Select>
    </div>

    <div class="input-group year">
      <Select
        bind:value={expirationYear}
        on:click={checkExpiryDate}
        variant="filled"
        label="Year"
        required
        invalid={invalidYear}
      >
        {#each years as year}
          <Option value={year}>{year}</Option>
        {/each}
      </Select>
    </div>
    <HelperText
      class="expiration-validation"
      style="color: #D3302F;"
      persistent={invalidMonth}>Please enter a non-expired date.</HelperText
    >
  </div>

  <div class="input-with-tooltip">
    <div class="input-group">
      <Textfield
        class="input"
        bind:value={cvv}
        on:input={() => (cvv = filterInput(cvv))}
        variant="filled"
        type="tel"
        input$pattern={CC_REGEX.cvv}
        input$minLength="3"
        input$maxLength="4"
        input$autocomplete="cc-csc"
        label="CVV"
        required
      >
        <HelperText validationMsg slot="helper">
          Please enter your CVV number.
        </HelperText>
      </Textfield>
    </div>

    <Wrapper class="tooltip-wrapper" rich>
      <Icon style="font-size: 50px; color: #777;" class="material-icons"
        >help_outline</Icon
      >
      <Tooltip style="top: 25px; left: 25px;" persistent>
        <Title>How to find the CVV</Title>
        <Content>
          Your card's security code (CVV) is the 3 or 4 digit number located on
          the back of most cards.
        </Content>
      </Tooltip>
    </Wrapper>
  </div>

  <div class="btns">
    <div class="back-btn">
      <Button
        href="/checkout/delivery"
        color="secondary"
        variant="raised"
        title="Back to Delivery details"
        ><Label>Back</Label>
      </Button>
    </div>
    <div class="submit-btn">
      <Button variant="raised">
        <Label>Review your order</Label>
      </Button>
    </div>
  </div>
</form>

<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 3rem;
    width: 100%;
    max-width: 450px;
  }

  // expiration date input
  * :global(.expiration-label) {
    display: inline-flex;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .expiration-date {
    display: grid;
    grid-template-columns: 120px 150px;
    column-gap: 1rem;
    margin-bottom: 1rem;

    .input-group {
      margin-bottom: 0;
    }
  }

  * :global(.expiration-validation) {
    grid-column: 1 / 3;
  }

  // security code input
  .input-with-tooltip {
    display: flex;
    column-gap: 0.5rem;
    flex-basis: 50%;

    .input-group {
      max-width: 80px;
    }
  }

  * :global(.tooltip-wrapper) {
    display: inline-block;
    width: 100%;
    cursor: pointer;
  }

  // remove padding from tooltip title caused by _base.scss
  :global(h2) {
    padding-left: 0;
    padding-right: 0;
  }

  .btns {
    display: flex;
    justify-content: space-between;
  }
</style>
