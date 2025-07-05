import React from "react";
import styles from "./Card.module.css";
import Link from "@docusaurus/Link";

type Button = {
  label: string;
  url: string;
};

type CardProps = {
  imageUrl: string;
  title: string;
  chain_id?: string;
  buttons: Button[];
};

const Card: React.FC<CardProps> = ({ imageUrl, title, chain_id, buttons }) => {
  return (
    <div className="container">
      {/* <div className="row">
        // <div className="col col--3 margin-top--sm margin-bottom--sm"> */}
      <div className={styles.card}>
        <div className={styles.header}>
          <img src={imageUrl} alt={title} className={styles.image} />
          <div className={styles.textContainer}>
            <h3 className={styles.title}>{title}</h3>
            {chain_id && <p className={styles.chain_id}>{chain_id}</p>}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          {buttons.map((btn, idx) => (
            <Link key={idx} href={btn.url} className={styles.button}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
    //   </div>
    // </div>
  );
};

export default Card;
