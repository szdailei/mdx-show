import React from 'react';
import PropTypes from 'prop-types';

function Error({ error }) {
  return <h3>{error.toString()}</h3>;
}

Error.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object.isRequired,
};

export default Error;
