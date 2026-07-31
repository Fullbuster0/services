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
  /** Origin network for Archive tab badge */
  networkType?: "mainnet" | "testnet";
  /** Muted surface + Archive chip when true */
  archived?: boolean;
};

function getButtonClass(label: string): string {
  switch (label.toLowerCase()) {
    case "services":
      return styles.buttonAccent;
    case "explorer":
      return styles.buttonOutline;
    case "delegate":
      return styles.buttonPrimary;
    default:
      return "";
  }
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  chain_id,
  buttons,
  networkType,
  archived = false,
}) => {
  const cardClass = archived
    ? `${styles.card} ${styles.cardArchived}`
    : styles.card;

  const showBadges = archived || !!networkType;

  return (
    <div className={cardClass}>
        <div className={styles.header}>
          <div className={styles.imageWrapper}>
            <img src={imageUrl} alt={title} className={styles.image} />
          </div>
          <div className={styles.textContainer}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{title}</h3>
              {showBadges && (
                <div className={styles.badgeGroup}>
                  {networkType && (
                    <span
                      className={
                        networkType === "mainnet"
                          ? styles.badgeMainnet
                          : styles.badgeTestnet
                      }
                    >
                      {networkType === "mainnet" ? "Mainnet" : "Testnet"}
                    </span>
                  )}
                  {archived && (
                    <span
                      className={styles.badgeArchive}
                      title="No longer actively validated"
                    >
                      Archive
                    </span>
                  )}
                </div>
              )}
            </div>
            {chain_id && <p className={styles.chain_id}>{chain_id}</p>}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          {buttons.map((btn, idx) => (
            <Link
              key={idx}
              href={btn.url}
              className={`${styles.button} ${getButtonClass(btn.label)}`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
    </div>
  );
};

export default Card;
