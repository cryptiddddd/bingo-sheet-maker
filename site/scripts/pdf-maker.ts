import type { jsPDF } from "jspdf";
import type { ListInput } from "./list-input.ts";

import { BingoSheet } from "./bingo-filler.js";


const [ WIDTH_INCHES, HEIGHT_INCHES ] = [ 8.3, 11.7 ];

// getting fields
const titleField = document.getElementById("sheet-title") as HTMLInputElement;
const countField = document.getElementById("sheet-count") as HTMLInputElement;

const cssField = document.getElementById("extra-css") as HTMLTextAreaElement;

const itemListInputs = (window as any).itemListInputs as ListInput[];

const predictionFields = itemListInputs[0];
const freeSpaceFields = itemListInputs[1];


// button callback
(document.getElementById("make-pdfs") as HTMLButtonElement)?.addEventListener("click", async () => {
    const template = await fetchTemplate();
    console.log(template);
    
    for (let i = 0; i < Number(countField.value); i++) {
        console.log("printing", i);
        
        generatePage(template, i);
    }
});


function generatePage(template: Document, idx: number) {
    console.log(template.body);

    const title = titleField.value || "BINGO";
    const css = cssField.value || "";

    // fill in template
    const sheet = new BingoSheet(template, title, predictionFields, freeSpaceFields, css);
    
    //@ts-ignore    
    const doc = (new jspdf.jsPDF({
        format: [ WIDTH_INCHES, HEIGHT_INCHES],
        unit: "in"
    }) as jsPDF)

    const [ width, height ] = [ doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight() ];
    const [ windowWidth, windowHeight ] = [ 96 * WIDTH_INCHES, 96 * HEIGHT_INCHES]

    doc.html(sheet.makeSheet().documentElement, {
        callback: function (d) {
            d.deletePage(2);
            d.save(`${title.replaceAll(/[^A-Z0-9]/gmi, "-")}-${idx}.pdf`);
        },
        html2canvas: {
            height,
            windowHeight,
            x: 0,
        },
        x: 0,
        y: 0,
        width,
        windowWidth, 
    });
}


async function fetchTemplate(): Promise<Document> {
    const response = await fetch('bingo-template.html');
    const text =  await response.text();

    const newDom = new DOMParser().parseFromString(text, "text/html");
    console.log(newDom.styleSheets);
    console.log(newDom.head);

    return newDom;
}
