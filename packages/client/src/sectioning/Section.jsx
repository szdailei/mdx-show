import React from 'react';
import styled from '../styled/styled';

/**
@examples
const gridTemplateAreas = `
'header'
'main'
'footer'
`;
<Section style={{gridTemplateColumns:"1fr", gridTemplateRows:"auto 1fr auto", gridTemplateAreas:{gridTemplateAreas}}}>
    <Header>{headerData}</Header>
    <Main>{mainData}</Main>
    <Footer>{footerData}</Footer>
</Section>
*/
// eslint-disable-next-line react/prop-types
const Section = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    display: 'grid',
    ...style,
  };
  const Styled = styled('section');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Section;
