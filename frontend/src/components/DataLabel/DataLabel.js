import React from 'react';

import Typography from '@material-ui/core/Typography';
import BadgeList from 'components/BadgeList/BadgeList';

export default ({ labelText, dataText, isAList=false }) => {
  return (
    <div>
      <Typography variant="body1" align="left" color="textSecondary">
        {labelText}
      </Typography>
      {
        isAList ? (
          <BadgeList items={dataText} />
        ) : labelText === "Website" ? (
              <a href={dataText} target="_blank" rel="noopener noreferrer">{dataText}</a>
          ): 
          (
            <Typography variant="body1" align="left" color="textPrimary">
              {labelText === 'Phone' ? (
                <a href={`tel:${dataText}`}>{dataText}</a>
              ) : dataText}
            </Typography>
          )
        
      }
    </div>
    
  )
}
