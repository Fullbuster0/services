import React from "react";
import styles from "./RelayerCard.module.css";

type RelayerCardProps = {
  imgSrc1: string;
  imgAlt1?: string;
  title1?: string;
  subtitleLink1?: string;
  imgSrc2: string;
  imgAlt2?: string;
  title2?: string;
  subtitleLink2?: string;
};

const ArrowIcon = () => (
  <div className={styles.arrow}>
    <svg className={styles.arrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24z" />
      <path d="M488 320H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z" />
    </svg>
  </div>
);

const RelayerCard: React.FC<RelayerCardProps> = ({ imgSrc1, imgAlt1, title1, subtitleLink1, imgSrc2, imgAlt2, title2, subtitleLink2 }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageRow}>
        <div className={styles.imageWrapper}>
          <img src={imgSrc1} alt={imgAlt1} className={styles.image} />
          {title1 && <p className={styles.title}>{title1}</p>}
          {subtitleLink1 && (
            <a href={subtitleLink1} className={styles.subtitle} target="_blank" rel="noopener noreferrer">
              Wallet
            </a>
          )}
        </div>

        <ArrowIcon />

        <div className={styles.imageWrapper}>
          <img src={imgSrc2} alt={imgAlt2} className={styles.image} />
          {title2 && <p className={styles.title}>{title2}</p>}
          {subtitleLink2 && (
            <a href={subtitleLink2} className={styles.subtitle} target="_blank" rel="noopener noreferrer">
              Wallet
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelayerCard;
