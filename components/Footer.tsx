import { css } from '@emotion/react'
import { useMediaContext } from "./@zora/context/useMediaContext";

export const Footer = () => {
  const { getStyles } = useMediaContext();
  return (
    <div {...getStyles("footerTopBorder")}>
      <div {...getStyles("removeOverflow")}><a css={{textDecoration: 'none', color: 'black'}} href='https://gnars.wtf/' target='blank'>gnars.wtf</a></div>
      <div {...getStyles("removeOverflow")}><a css={{textDecoration: 'none', color: 'black'}} href='https://gna.rs/' target='blank'>gna.rs</a></div>
    </div>
  )
}
