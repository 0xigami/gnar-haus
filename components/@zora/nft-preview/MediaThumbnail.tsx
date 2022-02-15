import { useContext } from "react";
import { MediaObject } from "../components/MediaObject";
import { useMediaContext } from "../context/useMediaContext";
import { NFTDataContext } from "../context/NFTDataContext";
import { defaultGetContentData, GetContentDataType, } from "../utils/getContentDataOptions";
import type { StyleProps } from "../utils/StyleTypes";
import { Global, css } from '@emotion/react'

const styles = css`
    @font-face {
      @import url('https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@300;400;900&display=swap');
    }  
  `;

export const MediaThumbnail = ({
  getContentData = defaultGetContentData,
  className,
}: GetContentDataType & StyleProps) => {
  const {
    nft: { data },
    metadata: { metadata },
  } = useContext(NFTDataContext);

  const { getStyles, getString } = useMediaContext();

  const getContent = () => {
    if (metadata && data) {
      return {
        media: <MediaObject {...getContentData(data, metadata)} />,
        title: metadata.name,
      };
    }
    return {
      media: <div {...getStyles("mediaLoader")}></div>,
      title: "...",
    };
  };

  const { media, title } = getContent();
  const hasCreator = data?.nft.creator;
  const address = hasCreator ? data?.nft.creator : data?.nft.owner;
  const _image = media.props.metadata.image
  return (
    <div>
      <Global styles={styles} />
      <img src={_image}/>
      <div {...getStyles("cardItemInfo")}>
        <h2 {...getStyles("cardTitle")}>{title}</h2>
      </div>
    </div>
  );
};
