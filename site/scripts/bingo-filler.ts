import type { ListInput } from "./list-input";


function pickRandom<T>(list: T[]): T {
    const rand = Math.random();
    console.log("PICK RANDOM", rand)
    return list[Math.floor(rand * list.length)];
}

function shuffle<T>(list: T[]): void {
    for (let i = list.length - 1; i > 0; i--) { 
        const rand = Math.random();
        console.log("SHUFFLE", rand);
        // Generate random index 
        const j = Math.floor(rand * (i + 1));
                    
        // Swap elements at indices i and j
        const temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }
}


export class BingoSheet {
    template: Document;
    
    title: string;
    
    freeSpaceText: string;
    predictions: string[];

    extraCSS: string;

    size: number = 5;

    constructor(template: Document, title: string, predictionInputs: ListInput, freeSpaces: ListInput, css: string) {
        // assign template, pick a free space text
        this.template = template;
        this.freeSpaceText = pickRandom(freeSpaces.values());

        // pick predictions
        const predictionTexts = predictionInputs.values();
        shuffle(predictionTexts);
        this.predictions = predictionTexts.slice(0, this.size * this.size - 1);

        this.title = title;
        this.extraCSS = css;
    }

    makeSheet(): Document {
        // fill heading
        const titleHeading = this.template.getElementById("title") as HTMLHeadingElement;
        titleHeading.innerText = this.title;
        

        // fill free cell
        const freeCell = this.template.getElementById("free-cell") as HTMLDivElement;
        freeCell.innerText = this.freeSpaceText;

        // gather prediction cells
        const predictionCells = Array.from(this.template.getElementsByClassName("cell") as HTMLCollectionOf<HTMLDivElement>).filter((cell: HTMLDivElement) => cell.id !== "free-cell");

        // run through predictions
        predictionCells.forEach((cell: HTMLDivElement, idx: number) => {
            cell.innerText = this.predictions[idx];
        });

        // add extra css
        if (this.extraCSS) {
            const styleElem = document.createElement("style") as HTMLStyleElement;
            styleElem.innerText = this.extraCSS;

            this.template.head.appendChild(styleElem);
        }

        return this.template;
    }
}
