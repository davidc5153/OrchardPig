<script>
  import Button, { Label } from "@smui/button";
</script>

<section>
  <img
    src="/images/underConstruction.svg"
    height="168"
    width="300"
    alt="Two construction workers"
  />
  <h2>We're working on it</h2>
  <p>
    In the meantime, to make a booking at The Flying Pig call <a
      href="tel:0427144200">0427 144 200</a
    >
    or email
    <a href="mailto:restaurant@orchardpig.com.au"
      >restaurant@orchardpig.com.au</a
    >.
  </p>
  <Button href="/" variant="raised" title="Go to Home page">
    <Label>Back to home</Label>
  </Button>
</section>

<style>
  section {
    text-align: center;
    margin: 3rem 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h2,
  p {
    padding: 0;
  }

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  img,
  p {
    margin-bottom: 2rem;
  }

  img {
    height: auto;
    width: 100%;
  }

  p {
    max-width: 500px;
  }
</style>
