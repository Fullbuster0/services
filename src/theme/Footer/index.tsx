import React from "react";
import { FaDiscord, FaEnvelope, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer footer-dark">
      {/* Top glow line */}
      <div className="footer-glow" />

      <div className="container py-5">
        {/* ─── 3-Column Links ─── */}
        <div className="row">
          {/* Networks */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h5 className="footer-heading">Networks</h5>
            <ul className="list-unstyled footer-links mt-3">
              <li>
                <Link to="/mainnets">Mainnets</Link>
              </li>
              <li>
                <Link to="/testnets">Testnets</Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h5 className="footer-heading">Links</h5>
            <ul className="list-unstyled footer-links mt-3">
              <li>
                <Link to="/relayers">Relayers</Link>
              </li>
              <li>
                <a
                  href="https://monitor.shazoes.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Monitoring Uptime
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.shazoes.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explorer
                </a>
              </li>
            </ul>
          </div>

          {/* Connect / Social */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h5 className="footer-heading">Connect</h5>
            <div className="footer-social-icons mt-3">
              <a
                href="https://x.com/shazoes"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Follow us on X (Twitter)"
              >
                <FaXTwitter size={20} />
              </a>
              <a
                href="http://discordapp.com/users/906483432811561000"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Join our Discord"
              >
                <FaDiscord size={20} />
              </a>
              <a
                href="https://t.me/shazoes"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Join our Telegram"
              >
                <FaTelegram size={20} />
              </a>
              <a
                href="mailto:hello@shazoes.xyz"
                className="footer-social-link"
                aria-label="Send us an email"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* ─── Copyright ─── */}
        <div className="footer-divider" />
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Shazoes
        </p>
      </div>
    </footer>
  );
};

export default Footer;
