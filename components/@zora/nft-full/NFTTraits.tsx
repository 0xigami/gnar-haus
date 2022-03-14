
import React from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import SkateContractAbi from "../../abis/SkateContract.json";
import { AbiItem } from 'web3-utils';
import {imageData} from '../../image-data/image-data.js';

interface SeedType {
  accessory: string;
  background: string;
  body: string;
  glasses: string;
  head: string;
}

export const NFTTraits = ({ id }: { id: string }) => {
  
  const [ traits, setTraits ] = React.useState<SeedType | null>(null);
  const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_URL as string);
  const nftContract = new web3.eth.Contract(SkateContractAbi as AbiItem[], process.env.NEXT_PUBLIC_TARGET_CONTRACT_ADDRESS);
  const backgrounds = imageData.bgcolors.map(v => v.filename);
  const bodies = imageData.images.bodies.map(v => v.filename);
  const heads = imageData.images.heads.map(v => v.filename);
  const glassess = imageData.images.glasses.map(v => v.filename);
  const accessories = imageData.images.accessories.map(v => v.filename);
  
  React.useEffect(() => {   
    nftContract.methods.seeds(id).call((err: any, result: SeedType) => {
      if (err){
        
      } else {
        setTraits(result);
        
      }
    });
  },[id]);

  return (
    <>
      {
        traits && 
        <div>
          <div className="d-flex align-items-center ps-2"><span css={{fontSize: '12px'}}>⬤</span><span className="ps-2">{heads[parseInt(traits.head)]}</span></div>
          <div className="d-flex align-items-center ps-2"><span css={{fontSize: '12px'}}>⬤</span><span className="ps-2">{bodies[parseInt(traits.body)]}</span></div>
          <div className="d-flex align-items-center ps-2"><span css={{fontSize: '12px'}}>⬤</span><span className="ps-2">{glassess[parseInt(traits.glasses)]}</span></div>
          <div className="d-flex align-items-center ps-2"><span css={{fontSize: '12px'}}>⬤</span><span className="ps-2">{accessories[parseInt(traits.accessory)]}</span></div>
          <div className="d-flex align-items-center ps-2"><span css={{fontSize: '12px'}}>⬤</span><span className="ps-2">{backgrounds[parseInt(traits.background)]}</span></div>
        </div>
      }
      
    </>
  );
};
