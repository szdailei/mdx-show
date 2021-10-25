import React from 'react';
import styled from '../styled/styled';

/**
@examples
<Article>{data}</Article>
*/
// eslint-disable-next-line react/prop-types
const Article = React.forwardRef(({ style, ...rest }, ref) => {
  const objStyle = {
    fontFamily:
      '"Noto Serif","Times New Roman", "Noto Color Emoji","Font Awesome 5 Free","Noto Serif CJK SC","PingFang SC","Microsoft Yahei",serif',
    letterSpacing: '1px',
    ...style,
  };

  const Styled = styled('article');
  return <Styled {...rest} style={objStyle} ref={ref} />;
});

export default Article;
