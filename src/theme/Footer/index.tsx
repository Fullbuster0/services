import React from "react";
import { FaDiscord, FaEnvelope, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer footer-dark bg-dark text-light">
      <div className="container">
        <div className="row">
          {/* Networks */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h5>Networks</h5>
            <ul className="list-unstyled mt-3">
              <li>
                <Link to="/mainnets" className="text-light">
                  Mainnets
                </Link>
              </li>
              <li>
                <Link to="/testnets" className="text-light">
                  Testnets
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h5>Links</h5>
            <ul className="list-unstyled mt-3">
              <li>
                <Link to="/relayers" className="text-light">
                  Relayers
                </Link>
              </li>
              <li>
                <a href="https://monitor.shazoes.xyz" className="text-light" target="_blank" rel="noopener noreferrer">
                  Monitoring Uptime
                </a>
              </li>
              <li>
                <a href="https://explorer.shazoes.xyz" className="text-light" target="_blank" rel="noopener noreferrer">
                  Explorer
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <h5>Contacts</h5>
            <div className="d-flex mt-3">
              <a href="https://x.com/shazoes" target="_blank" rel="noopener noreferrer" className="text-light me-2">
                <FaXTwitter size={22} />
              </a>
              <a href="http://discordapp.com/users/906483432811561000" target="_blank" rel="noopener noreferrer" className="text-light me-2">
                <FaDiscord size={22} />
              </a>
              <a href="https://t.me/shazoes" target="_blank" rel="noopener noreferrer" className="text-light me-2">
                <FaTelegram size={22} />
              </a>
              <a href="mailto:hello@shazoes.xyz" className="text-light">
                <FaEnvelope size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4">
          <p>&copy; {new Date().getFullYear()} Shazoes</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
