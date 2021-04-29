import React, { CSSProperties, useEffect } from 'react';
import starFull from '../images/star-full.png'
import starEmpty from '../images/star-empty.png'

const Cooldown = (props: {complete: number}): React.ReactElement => {
  const { complete } = props;

  // The progress bar turns green if the ability is ready
  // bgcolor = complete === 100 ? "#008000" : bgcolor;

  const styles: { [key: string]: CSSProperties } = {
    containerStyles: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
      height: '32px',
      width: '100%',
    },
    seconds: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontWeight: 'bolder',
      fontSize: '16px'
    },
    star: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    }
  }

  return (
    <div>
      {complete === 100
        ? <div style={styles.containerStyles}> 
            <img style={styles.star} alt='' src={starFull} width='32' height='32' />  
          </div>
        : <div style={styles.containerStyles}>
            <img style={styles.star} alt='' src={starEmpty} width='32' height='32' />
            <div style={styles.seconds}>
              {complete}
            </div>
          </div>
      }
    </div>
  );
};

export default Cooldown;

