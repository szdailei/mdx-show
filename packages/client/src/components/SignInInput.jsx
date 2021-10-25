/* eslint-disable react/forbid-prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Div, Input, Label } from '../styled';

function SignInInput({ userNameRef, passwordRef, userName }) {
  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    if (userName) userNameRef.current.value = userName;
  });

  return (
    <Div style={{ textAlign: 'center' }}>
      <Div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" ref={userNameRef} style={{ marginLeft: '1em' }} placeholder="Username" />
      </Div>
      <Div style={{ marginTop: '2em' }}>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" ref={passwordRef} style={{ marginLeft: '1em' }} placeholder="Password" />
      </Div>
    </Div>
  );
}

SignInInput.propTypes = {
  userNameRef: PropTypes.object.isRequired,
  passwordRef: PropTypes.object.isRequired,
  userName: PropTypes.string,
};

SignInInput.defaultProps = {
  userName: null,
};

export default SignInInput;
