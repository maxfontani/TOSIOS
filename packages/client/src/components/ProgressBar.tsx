import React, { CSSProperties, useEffect } from 'react';


const ProgressBar = (props: {bgcolor: string, complete: number}): React.ReactElement => {
  let { bgcolor, complete } = props;

  // The progress bar turns green if the ability is ready
  bgcolor = complete === 100 ? "#008000" : bgcolor;

  const styles: { [key: string]: CSSProperties } = {
    containerStyles: {
    height: 20,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    },
    fillerStyles: {
      height: '100%',
      width: `${complete}%`,
      backgroundColor: bgcolor,
      borderRadius: 'inherit',
      textAlign: 'right',
      // transition: ''
    },
    labelStyles: {
      padding: 5,
      color: 'white',
      fontWeight: 'bold'
    }}

  complete < 700 ? styles.fillerStyles.transition = 'width 1s ease-in-out' : styles.fillerStyles.transition = '';

  return (
    <div style={styles.containerStyles}>
      <div style={styles.fillerStyles}>
        <span style={styles.labelStyles}></span>
      </div>
    </div>
  );
};

export default ProgressBar;
