<script context="module">
  const currentYear = new Date().getFullYear();
</script>

<script>
  import SocialIcons from "@rodneylab/svelte-social-icons";

  const fgColor = "#8F4305";
  const bgColor = "#EEE";
</script>

<footer>
  <!-- Opening Hours -->
  <section class="opening-hours">
    <h2>Opening Hours</h2>
    <p>Monday - Thursday 12pm - 10pm</p>
    <p>Friday - Sunday 11am - 11pm</p>
  </section>

  <!-- Social Media Links -->
  <section class="social">
    <h2>Connect with us</h2>
    <div class="social-links">
      <a
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener"
        title="Link to Orchard Pig Facebook page"
      >
        <SocialIcons network="facebook" {fgColor} {bgColor} />
      </a>
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener"
        title="Link to Orchard Pig Instagram page"
      >
        <SocialIcons network="instagram" {fgColor} {bgColor} />
      </a>
      <a
        href="https://www.twitter.com"
        target="_blank"
        rel="noopener"
        title="Link to Orchard Pig Twitter profile"
      >
        <SocialIcons network="twitter" {fgColor} {bgColor} />
      </a>
    </div>
  </section>

  <!-- Legal Stuff -->
  <section class="legal">
    <h2>Please note</h2>
    <p>
      Under the Liqour Control Act 1988, it is an offence: to sell or supply
      liquor to a person under the age of 18 years on licensed or regulated
      premises; or for a person under the age of 18 years to purchase, or
      attempt to purchase, liquor on licensed or refulated premises. Producers
      License: 6180105495
    </p>
  </section>

  <!-- Copyright -->
  <span class="copyright">&#169; Orchard Pig {currentYear}</span>

  <!-- Reference -->
  <section class="education">
    <p>
      This site was made for educational purposes for Curtin University, DIG33 -
      DigEx Studio.
    </p>
    <a href="/references" title="Link to References page">References</a>
  </section>
</footer>

<!-- Styles -->
<style lang="scss">
  footer {
    @include col;
    align-items: center;
    padding: 1rem;
    background: $footer;
    text-align: center;
    color: #fff;

    h2,
    p {
      padding: 0;
    }

    h2 {
      font-family: "IBM Plex Sans", sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1rem;
      font-weight: 300;
    }

    a {
      color: #fff;
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }

    .opening-hours {
      margin-top: 3rem;
    }

    .social,
    .legal {
      h2 {
        text-transform: uppercase;
      }
    }

    // social media section
    .social {
      margin-top: 3rem;
      width: 100%;

      .social-links {
        display: flex;
        justify-content: center;
        margin-top: 1rem;

        a {
          display: inline-block;
          --margin: 0.8rem;
          margin-left: var(--margin);
          margin-right: var(--margin);

          &:hover {
            opacity: 0.7;
          }
        }
      }
    }

    .legal {
      margin-top: 3.5rem;

      h2 {
        font-size: 1rem;
        font-weight: 300;
      }

      p {
        font-size: 0.9rem;
      }
    }

    .copyright {
      display: block;
      margin-top: 3rem;
      margin-bottom: 2rem;
      font-weight: 300;
    }

    .education {
      opacity: 0.5;
      margin-bottom: 1.5rem;
      font-size: 0.83rem;
      font-weight: 300;

      p {
        font-size: 0.83rem;
      }
    }
  }
</style>
