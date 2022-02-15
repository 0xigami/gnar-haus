import React from "react";
import { css } from '@emotion/react';

export const Pagination = ({ postsPerPage, totalPosts, paginate } : { postsPerPage:number, totalPosts:number, paginate: any  }) => {
    const[pageNumbers, setPageNumbers] = React.useState<number[]>([]);
    let pageNumber: number[] = [];

    React.useEffect(() => {   
        for(let x = 1; x <= Math.ceil(totalPosts / postsPerPage); x++){
            pageNumber.push(x);   
        }
        setPageNumbers(pageNumber)
    },[totalPosts, postsPerPage, paginate]);

    return (
        <div
            css={css`
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                background; black;
                margin-top: 20px;
                color: blue;`}>
            {
                pageNumbers && pageNumbers.map((number) => {
                    return(
                        <button
                        onClick={() => paginate(number)} key={number}
                        css={css`
                        border: none;
                        color: black;
                        font-size: 31px;
                        cursor: pointer`}>
                        {number}
                        </button>
                    )
                    })
            }
        </div>
        
    );
};